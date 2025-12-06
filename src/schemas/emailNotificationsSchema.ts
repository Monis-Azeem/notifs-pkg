import * as z from "zod";

export const emailNotifications = z.object({
  email: z.email(),
  body: z.string().min(1),
});

export type EmailNotifications = z.infer<typeof emailNotifications>;
