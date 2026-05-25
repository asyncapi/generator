---
"@asyncapi/generator": patch
---

Fix `fetchSpec` silently resolving on non-2xx HTTP responses. Previously, fetching an AsyncAPI document from a URL that returned a 4xx or 5xx status would resolve with the error response body (e.g. an HTML page) instead of rejecting. `fetchSpec` now throws a descriptive error including the URL and HTTP status code, so failures are surfaced immediately rather than propagating as invalid spec content.
