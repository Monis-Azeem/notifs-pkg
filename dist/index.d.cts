import * as z from 'zod';

declare const emailNotifications: z.ZodObject<{
    email: z.ZodEmail;
    body: z.ZodString;
}, z.core.$strip>;
type EmailNotifications = z.infer<typeof emailNotifications>;

declare const config: z.ZodObject<{
    redis: z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
type Config = z.infer<typeof config>;

declare class NotificationManager {
    private queues;
    private workers;
    private redis;
    constructor(config: Config);
    sendEmail(emailNotification: EmailNotifications): Promise<void>;
}

export { NotificationManager };
