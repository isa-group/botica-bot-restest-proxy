import { IncomingMessage } from "node:http";
import { Bot } from "botica-lib-node";

export type HandlerFunction = (
  req: IncomingMessage,
  host: string,
  res: IncomingMessage,
  body: string,
  bot: Bot,
) => void;

export { handleQuotaError } from "./quotaErrorHandler.js";
