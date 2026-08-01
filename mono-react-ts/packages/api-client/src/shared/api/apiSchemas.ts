import { z } from 'zod'

export type ApiResponse<TData> = {
  data: TData
}

export const apiSuccessResponseSchema = z.object({
  success: z.literal(1),
})

export type ApiSuccessResponse = z.infer<typeof apiSuccessResponseSchema>

export function apiResponseSchema<TData>(dataSchema: z.ZodType<TData>) {
  return z.object({
    data: dataSchema,
  })
}

export function parseApiResponse<TData>(
  value: unknown,
  dataSchema: z.ZodType<TData>,
) {
  return apiResponseSchema(dataSchema).parse(value).data
}
