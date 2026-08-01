import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

function getExportTarget(exportValue) {
  if (typeof exportValue === 'string') {
    return exportValue
  }

  if (typeof exportValue === 'object' && exportValue !== null) {
    return exportValue.import ?? exportValue.default ?? exportValue.types
  }

  return null
}

function getImportSpecifier(packageName, exportKey) {
  if (exportKey === '.') {
    return packageName
  }

  return `${packageName}/${exportKey.replace(/^\.\//, '')}`
}

async function getWorkspacePackageDirectories(workspacePattern) {
  const baseDirectory = workspacePattern.replace(/\/\*$/, '')
  const absoluteBaseDirectory = path.join(rootDirectory, baseDirectory)
  const entries = await readdir(absoluteBaseDirectory, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDirectory, entry.name))
}

const rootPackageJson = await readJson(path.join(rootDirectory, 'package.json'))
const tsconfig = await readJson(path.join(rootDirectory, 'tsconfig.base.json'))
const configuredPaths = tsconfig.compilerOptions?.paths ?? {}
const expectedPaths = new Map()

for (const workspacePattern of rootPackageJson.workspaces ?? []) {
  for (const packageDirectory of await getWorkspacePackageDirectories(workspacePattern)) {
    const packageJsonPath = path.join(rootDirectory, packageDirectory, 'package.json')
    const packageJson = await readJson(packageJsonPath)

    if (!packageJson.name || !packageJson.exports) {
      continue
    }

    for (const [exportKey, exportValue] of Object.entries(packageJson.exports)) {
      const target = getExportTarget(exportValue)

      if (!target) {
        throw new Error(`${packageJson.name}: unsupported export target for ${exportKey}`)
      }

      if (!target.endsWith('.ts') && !target.endsWith('.tsx')) {
        continue
      }

      expectedPaths.set(getImportSpecifier(packageJson.name, exportKey), [
        `./${normalizePath(path.join(packageDirectory, target))}`,
      ])
    }
  }
}

const errors = []

for (const [specifier, expectedPath] of expectedPaths.entries()) {
  const actualPath = configuredPaths[specifier]

  if (!actualPath) {
    errors.push(`${specifier}: missing tsconfig path ${JSON.stringify(expectedPath)}`)
    continue
  }

  if (JSON.stringify(actualPath) !== JSON.stringify(expectedPath)) {
    errors.push(
      `${specifier}: expected ${JSON.stringify(expectedPath)}, got ${JSON.stringify(actualPath)}`,
    )
  }
}

for (const specifier of Object.keys(configuredPaths)) {
  if (specifier.startsWith('@mono/') && !expectedPaths.has(specifier)) {
    errors.push(`${specifier}: stale tsconfig path without package export`)
  }
}

if (errors.length > 0) {
  throw new Error(`Package exports and tsconfig paths are out of sync:\n${errors.join('\n')}`)
}

console.log('✓ Package exports and tsconfig paths are in sync')
