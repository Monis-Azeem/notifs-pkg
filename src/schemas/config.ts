import * as z from "zod";
import { redisSchema } from "./redisSchema.ts";

export const config = z.object({
  redis: redisSchema,
});

export type Config = z.infer<typeof config>;
