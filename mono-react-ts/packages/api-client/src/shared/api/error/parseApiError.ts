import axios from 'axios'

import { API_ERROR_TEXTS } from '../../config'

import { isDomainErrorResponse, isValidationErrorResponse } from './guards'
import type { ParsedApiError } from './types'

function withStatus<TError extends ParsedApiError>(error: TError, status?: number) {
  if (status === undefined) {
    return error
  }

  return {
    ...error,
    status,
  }
}

export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return {
      type: 'unknown',
      message: API_ERROR_TEXTS.unknown,
    }
  }

  const status = error.response?.status
  const data = error.response?.data

  if (status === 422 && isValidationErrorResponse(data)) {
    return {
      type: 'validation',
      message: API_ERROR_TEXTS.requestFailed,
      validations: data.validations,
    }
  }

  if (isDomainErrorResponse(data) && data.error?.message) {
    return withStatus(
      {
        type: 'domain',
        message: data.error.message,
      },
      status,
    )
  }

  return withStatus(
    {
      type: 'unknown',
      message: API_ERROR_TEXTS.requestFailed,
    },
    status,
  )
}
