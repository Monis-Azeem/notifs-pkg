import { Queue, Worker, Job } from "bullmq";
import {
  type Config,
  type EmailNotifications,
  type Redis,
} from "./schemas/index.ts";

export class NotificationManager {
  private queues: Record<string, Queue>;
  private workers: Record<string, Worker>;
  private redis: Redis;

  constructor(config: Config) {
    this.redis = config.redis;

    this.queues = {
      emailQueue: new Queue("email-queue"),
    };

    this.workers = {
      emailWorker: new Worker(
        "email-queue",
        //TODO: How to manage this job thing
        async (job: Job) => {
          console.log(`Email Job processing, Id:-> ${job.id}`);
        },
        {
          connection: {
            host: this.redis.host,
            port: this.redis.port,
          },
          //TODO: WE can change it i think in the future. Also jobs can be rate limited based on customer id.
          limiter: {
            max: 10,
            duration: 1000,
          },
        },
      ),
    };
  }

  async sendEmail(emailNotification: EmailNotifications) {
    this.queues.emailQueue?.add("email-notifications", emailNotification, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
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
}

//TODO: Also learn about worker removal and job removal before going to production
