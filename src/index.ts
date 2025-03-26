import botica from "botica-lib-node";
import { IncomingMessage } from "node:http";
import { createProxy } from "./proxy.js";
import { handleQuotaError, HandlerFunction } from "./handlers/index.js";

const handlers: [HandlerFunction] = [handleQuotaError];

const bot = await botica();
await bot.start();

export const notifyUser = async (message: string) => {
  await bot.publishOrder(message, "telegram_bot", "broadcast_message");
};

createProxy({
  responseInterceptor: async (
    req: IncomingMessage,
    target: string,
    res: IncomingMessage,
    body: string,
  ) => {
    handlers.forEach((handler) => handler(req, target, res, body, bot));
  },
});
