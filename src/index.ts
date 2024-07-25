import botica from "botica-lib-node";
import { IncomingMessage } from "node:http";
import { createProxy } from "./proxy.js";
import { handleQuotaError, HandlerFunction } from "./handlers/index.js";

const handlers: [HandlerFunction] = [handleQuotaError];

const bot = await botica();
await bot.start();

createProxy({
  responseCallback: async (
    req: IncomingMessage,
    target: string,
    res: IncomingMessage,
    body: string,
  ) => {
    handlers.forEach((handler) => handler(req, target, res, body, bot));
  },
});
