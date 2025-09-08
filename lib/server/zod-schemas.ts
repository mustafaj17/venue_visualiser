import { z } from "zod";

export const idQuerySchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const createItemBodySchema = z
  .object({
    name: z.string().trim().min(1, "name is required"),
    description: z.string().trim().min(1, "description is required"),
    userId: z.string().trim().min(1, "userId is required"),
  })
  .strict();

export type CreateItemInput = z.infer<typeof createItemBodySchema>;
