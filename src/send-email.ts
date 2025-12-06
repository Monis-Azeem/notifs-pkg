import { Queue } from "bullmq";

//TODO: Jobs can be rate limited based on customer Id. Can be applied here
const emailQueue = new Queue("email-queue");

export const sendEmail = (msg: string) => {
  emailQueue.add("email-notifications", msg, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};

emailQueue.on("error", (err) => {
  console.error("Email Queue Error->", err);
});
