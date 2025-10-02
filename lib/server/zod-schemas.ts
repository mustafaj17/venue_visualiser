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
  })
  .strict();

export type CreateItemInput = z.infer<typeof createItemBodySchema>;

export const updateItemBodySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
    path: ["_"],
  })
  .strict();

export type UpdateItemInput = z.infer<typeof updateItemBodySchema>;
