import { z } from "zod";

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const PlatformDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional(),
});

export const PlatformSchema = z.object({
  platform: PlatformDetailsSchema,
});

export const RawgGameSchema = z.object({
  id: z.number(),
  name: z.string(),
  background_image: z.string().nullable().optional(),
  rating: z.number(),
  ratings: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        count: z.number(),
        percent: z.number(),
      })
    )
    .optional(),
  released: z.string().nullable().optional(),
  tba: z.boolean().optional(),
  genres: z.array(GenreSchema).default([]),
  metacritic: z.number().nullable().optional(),
  platforms: z.array(PlatformSchema).default([]),
  description_raw: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        slug: z.string(),
      })
    )
    .optional(),
  achievements_count: z.number().optional(),
  parent_games: z.array(z.any()).optional(), // Recursive types in Zod are tricky, keeping simple for now
});

export const GamesResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(RawgGameSchema),
});

export type ZodRawgGame = z.infer<typeof RawgGameSchema>;
