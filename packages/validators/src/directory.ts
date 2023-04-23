import { z } from 'zod'

export const newDirectorySchema = z.object({
  location: z.string().min(1, { message: 'Select or create a new Category' }),
  category: z.string().min(1, { message: 'Select a directory' }),
  updateFrequencyInMinutes: z.number().optional().default(60),
})
