import express from "express";
import logger from "./logger.js";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { IncomingMessage } from "node:http";

export interface ProxyOptions {
  responseInterceptor?: (
    req: IncomingMessage,
    target: string,
    res: IncomingMessage,
    body: string,
  ) => void;
}

export const createProxy = (proxyOptions: ProxyOptions) => {
  const proxy = express();
  proxy.use(express.json());

  proxy.use((req, res, next) => {
    let target = req.headers["proxy-redirect"]!;
    if (Array.isArray(target)) target = target[0];

    logger.debug(`Redirecting request to ${target}${req.url}...`);

    const interceptor = responseInterceptor((buffer, proxyRes, req) => {
      proxyOptions.responseInterceptor?.(
        req,
        target,
        proxyRes,
        buffer.toString("utf8"),
      );
      return Promise.resolve(buffer);
    });

    createProxyMiddleware({
      target,
      changeOrigin: true,
      selfHandleResponse: true,
      on: {
        proxyRes: interceptor,
      },
    })(req, res, next);
  });

  proxy.listen(80, () => {
    logger.info("Proxy listening on port 80");
  });
};
