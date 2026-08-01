import type { ApiDomainErrorResponse, ApiValidationErrorResponse } from './types'

export function isValidationErrorResponse(
  value: unknown,
): value is ApiValidationErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as ApiValidationErrorResponse).validations)
  )
}

export function isDomainErrorResponse(
  value: unknown,
): value is ApiDomainErrorResponse {
  return typeof value === 'object' && value !== null && 'error' in value
}
