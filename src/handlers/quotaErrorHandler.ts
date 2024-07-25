import { IncomingMessage } from "node:http";
import { Bot } from "botica-lib-node";
import { HandlerFunction } from "./index.js";
import logger from "../logger.js";

const MINUTE = 60000;
const quotaErrorTimeout =
  parseInt(process.env.SERVICE_QUOTA_ERROR_TIMEOUT_MS ?? "") || MINUTE * 60;

const lastErrors: { [service: string]: Date } = {};

export const handleQuotaError: HandlerFunction = async (
  _req: IncomingMessage,
  host: string,
  res: IncomingMessage,
  _body: string,
  bot: Bot,
) => {
  if (res.statusCode !== 429) return;

  const now = new Date();
  const lastError = lastErrors[host] ?? new Date(0);
  if (lastError.getTime() + quotaErrorTimeout > now.getTime()) return;

  logger.info(
    `429 error detected for service ${host}! Restricting test generation...`,
  );
  await bot.publishOrder(
    { service: host, until: now.getTime() + quotaErrorTimeout },
    "generation_adjustment",
    "restrict_generation",
  );
  lastErrors[host] = now;
};
