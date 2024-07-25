# botica-bot-restest-proxy

## Introduction

This is a specialized bot that acts as an intermediary for all requests coming
from executor bots. It opens a server that proxies incoming requests, forwarding them to the actual
destination specified in the `Proxy-Redirect` header. The proxy maintains the original path, query
parameters, and headers while only changing the host.

Additionally, the bot intercepts responses and applies custom error-handling logic to ensure smooth
execution.

## Error Handling

The bot currently handles the following errors:

### 429 - Too Many Requests

If a service responds with a `429` status code, the bot publishes an order instructing generator
bots to pause execution for certain time.
- Default generation pause time: 1 hour
- Configurable via the environment variable `SERVICE_QUOTA_ERROR_TIMEOUT_MS`:
```bash
SERVICE_QUOTA_ERROR_TIMEOUT_MS=3600000
```

## Usage

To use the proxy bot, ensure that all requests include the required `Proxy-Redirect` header:

```http
Proxy-Redirect: https://new-target-service.com
```

This header specifies the new target where the request should be forwarded. The proxy bot will
maintain all other request details (path, query parameters, headers) while handling responses and
applying error-handling logic as needed.
