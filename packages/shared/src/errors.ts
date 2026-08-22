import { z } from 'zod';

export const apiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
  requestId: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
