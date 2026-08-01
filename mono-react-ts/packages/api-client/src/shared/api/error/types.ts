export type ApiValidationError = {
  field: string
  message: string
}

export type ApiValidationErrorResponse = {
  validations: ApiValidationError[]
}

export type ApiDomainErrorResponse = {
  error?: {
    message?: string
  }
}

export type ParsedApiError =
  | {
      type: 'validation'
      message: string
      validations: ApiValidationError[]
    }
  | {
      type: 'domain'
      message: string
      status?: number
    }
  | {
      type: 'unknown'
      message: string
      status?: number
    }
