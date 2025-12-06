import { Job, Worker } from "bullmq";

export const worker = new Worker(
  "email-queue",
  async (job: Job) => {
    console.log(`Job id processing-> ${job.id}`);
    console.log(`Email ${job.id} sent`);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    //TODO: WE can change it i think in the future. Also jobs can be rate limited based on customer id.
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);

worker.on("error", (err) => {
  console.error("Worker Error->", err);
});
