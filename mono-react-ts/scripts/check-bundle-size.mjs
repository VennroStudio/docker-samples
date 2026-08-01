import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const kilobyte = 1024

const applications = [
  {
    name: 'web',
    initialJavaScriptLimit: 180 * kilobyte,
    lazyChunks: [],
  },
  {
    name: 'admin',
    initialJavaScriptLimit: 180 * kilobyte,
    lazyChunks: [],
  },
]

function formatKilobytes(bytes) {
  return `${(bytes / kilobyte).toFixed(1)} kB gzip`
}

function assertBudget(name, actualSize, limit) {
  const message = `${name}: ${formatKilobytes(actualSize)} / ${formatKilobytes(limit)}`

  if (actualSize > limit) {
    throw new Error(`Bundle budget exceeded. ${message}`)
  }

  console.log(`✓ ${message}`)
}

function collectInitialJavaScript(manifest, chunkKey, collectedFiles = new Set()) {
  const chunk = manifest[chunkKey]

  if (!chunk) {
    throw new Error(`Vite manifest references an unknown chunk: ${chunkKey}`)
  }

  if (chunk.file.endsWith('.js')) {
    collectedFiles.add(chunk.file)
  }

  for (const importedChunk of chunk.imports ?? []) {
    collectInitialJavaScript(manifest, importedChunk, collectedFiles)
  }

  return collectedFiles
}

async function getCompressedSize(distDirectory, relativeFilePath) {
  const file = await readFile(path.join(distDirectory, relativeFilePath))

  return gzipSync(file, { level: 9 }).byteLength
}

async function getTotalCompressedSize(distDirectory, files) {
  const sizes = await Promise.all(
    [...files].map((file) => getCompressedSize(distDirectory, file)),
  )

  return sizes.reduce((total, size) => total + size, 0)
}

async function checkInitialJavaScript({ distDirectory, limit, manifest, name }) {
  const entry = Object.entries(manifest).find(([, chunk]) => chunk.isEntry)

  if (!entry) {
    throw new Error(`${name}: Vite manifest does not contain an application entry`)
  }

  const initialJavaScriptFiles = collectInitialJavaScript(manifest, entry[0])
  const initialJavaScriptSize = await getTotalCompressedSize(
    distDirectory,
    initialJavaScriptFiles,
  )

  assertBudget(`${name}: Initial JavaScript`, initialJavaScriptSize, limit)
}

async function checkLazyChunks({ distDirectory, lazyChunks, name }) {
  const assetFiles = await readdir(path.join(distDirectory, 'assets'))

  for (const lazyChunk of lazyChunks) {
    const chunkFile = assetFiles.find(
      (file) => file.startsWith(lazyChunk.prefix) && file.endsWith('.js'),
    )

    if (!chunkFile) {
      throw new Error(`${name}: ${lazyChunk.label} chunk was not found`)
    }

    const chunkSize = await getCompressedSize(
      distDirectory,
      path.join('assets', chunkFile),
    )

    assertBudget(`${name}: ${lazyChunk.label}`, chunkSize, lazyChunk.limit)
  }
}

for (const application of applications) {
  const distDirectory = path.join(rootDirectory, `apps/${application.name}/dist`)
  const manifestPath = path.join(distDirectory, '.vite/manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  await checkInitialJavaScript({
    distDirectory,
    limit: application.initialJavaScriptLimit,
    manifest,
    name: application.name,
  })
  await checkLazyChunks({
    distDirectory,
    lazyChunks: application.lazyChunks,
    name: application.name,
  })
}
