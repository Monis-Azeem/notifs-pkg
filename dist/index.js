// src/NotificationManager.ts
import { Queue, Worker } from "bullmq";

// src/schemas/emailNotificationsSchema.ts
import * as z from "zod";
var emailNotifications = z.object({
  email: z.email(),
  body: z.string().min(1)
});

// src/schemas/redisSchema.ts
import * as z2 from "zod";
var redisSchema = z2.object({
  host: z2.string().min(1),
  port: z2.number()
});

// src/schemas/config.ts
import * as z3 from "zod";
var config = z3.object({
  redis: redisSchema
});

// src/NotificationManager.ts
var NotificationManager = class {
  queues;
  workers;
  redis;
  constructor(config2) {
    this.redis = config2.redis;
    this.queues = {
      emailQueue: new Queue("email-queue")
    };
    this.workers = {
      emailWorker: new Worker(
        "email-queue",
        //TODO: How to manage this job thing
        async (job) => {
          console.log(`Email Job processing, Id:-> ${job.id}`);
        },
        {
          connection: {
            host: this.redis.host,
            port: this.redis.port
          },
          //TODO: WE can change it i think in the future. Also jobs can be rate limited based on customer id.
          limiter: {
            max: 10,
            duration: 1e3
          }
        }
      )
    };
  }
  async sendEmail(emailNotification) {
    this.queues.emailQueue?.add("email-notifications", emailNotification, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2e3
      }
    });
    this.queues.emailQueue?.on("error", (error) => {
      console.error("Email Queue Error->");
      throw new Error("Email Queue error->", error);
    });
    this.workers.emailWorker?.on("error", (error) => {
      console.error("Email Worker Error->", error);
      throw new Error("Email Worker error->", error);
    });
  }
};
export {
  NotificationManager
};
//# sourceMappingURL=index.js.map