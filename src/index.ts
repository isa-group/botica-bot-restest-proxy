import express from "express";
import logger from "./logger";
import { botica } from "botica-lib-node";
import proxy from "express-http-proxy";
import * as http from "node:http";
import * as https from "node:https";

const bot = await botica();

const app = express();
app.use(express.json());

app.use("/", (req, res, next) => {
  logger.info(
    `Redirecting ${JSON.stringify(req.query)}, ${JSON.stringify(req.params)} to ${req.headers.host}`,
  );
  proxy(req.headers.host!, { https: true })(req, res, next);
});

http
  .createServer({}, app)
  .listen(80, () => logger.info("HTTP server listening on port 80"));

https
  .createServer({}, app)
  .listen(443, () => logger.info("HTTPs server listening on port 443"));

await bot.start();
