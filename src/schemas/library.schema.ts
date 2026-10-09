import { z } from "zod";

export const libraryQuerySchema = z.object({
  status: z
    .enum([
      "WATCHING",
      "READING",
      "COMPLETED",
      "PLAN_TO_WATCH",
      "PLAN_TO_READ",
      "ON_HOLD",
      "DROPPED",
    ])
    .optional(),

  type: z.enum(["ANIME", "MANGA"]).optional(),

  favorite: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  search: z
    .string()
    .trim()
    .max(100)
    .optional(),

  sort: z
    .enum(["updatedAt", "addedAt", "title", "rating", "progress"])
    .default("updatedAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(24),
});

export type LibraryQuery = z.infer<typeof libraryQuerySchema>;