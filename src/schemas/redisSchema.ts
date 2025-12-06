import * as z from "zod";

export const redisSchema = z.object({
  host: z.string().min(1),
  port: z.number(),
});

export type Redis = z.infer<typeof redisSchema>;
