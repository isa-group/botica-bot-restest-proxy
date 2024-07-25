import express from "express";
import logger from "./logger.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const target = (req.query.url! as string).match(/[^\\?]*/)![0];
  logger.info(`Redirecting ${JSON.stringify(req.url)} to ${target}...`);
  logger.info(`  Headers: ${JSON.stringify(req.headers)}`);
  logger.info(`  Query params: ${JSON.stringify(req.query)}`);

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      "(\\?url=[^\\?]*)": "",
    },
    on: {
      proxyReq: (proxyReq) => {
        // proxy-https-middleware "feature" adding a trailing slash...
        if (!target.endsWith("/") && proxyReq.path.endsWith("/")) {
          proxyReq.path = proxyReq.path.slice(0, -1);
        }
      },
    },
  })(req, res, next);
});

app.listen(80, () => {
  logger.info("Proxy listening on port 80");
});
