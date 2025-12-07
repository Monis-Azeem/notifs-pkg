"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  NotificationManager: () => NotificationManager
});
module.exports = __toCommonJS(index_exports);

// src/NotificationManager.ts
var import_bullmq = require("bullmq");

// src/schemas/emailNotificationsSchema.ts
var z = __toESM(require("zod"), 1);
var emailNotifications = z.object({
  email: z.email(),
  body: z.string().min(1)
});

// src/schemas/redisSchema.ts
var z2 = __toESM(require("zod"), 1);
var redisSchema = z2.object({
  host: z2.string().min(1),
  port: z2.number()
});

// src/schemas/config.ts
var z3 = __toESM(require("zod"), 1);
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
      emailQueue: new import_bullmq.Queue("email-queue")
    };
    this.workers = {
      emailWorker: new import_bullmq.Worker(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NotificationManager
});
//# sourceMappingURL=index.cjs.map