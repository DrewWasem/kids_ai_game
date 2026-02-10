# Error Catalog

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unhandled exception |

## Error Response Format

All error responses follow this structure:

```json
{
  "detail": "Human-readable message",
  "error_id": "abc12345",
  "type": "error_type"
}
```

**Fields:**
- `detail`: User-facing error message (never includes stack traces or internals)
- `error_id`: Correlation ID for log tracing (8-char hex)
- `type`: Error category for client-side handling

## Rate Limit Headers

When rate limited, responses include:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 60
Retry-After: 30
```

**Fields:**
- `X-RateLimit-Limit`: Total requests allowed in window
- `X-RateLimit-Remaining`: Requests left in current window
- `X-RateLimit-Reset`: Seconds until window resets
- `Retry-After`: Seconds to wait before retrying (on 429 only)

## Common Error Types

### Authentication Errors

| Code | Type | Detail |
|------|------|--------|
| 401 | `missing_token` | "Authorization header required" |
| 401 | `invalid_token` | "Invalid or expired token" |
| 401 | `invalid_api_key` | "Invalid API key" |
| 403 | `insufficient_scope` | "Insufficient permissions" |

### Validation Errors

| Code | Type | Detail |
|------|------|--------|
| 422 | `validation_error` | Pydantic validation details |
| 400 | `invalid_input` | Custom validation failure |

### Resource Errors

| Code | Type | Detail |
|------|------|--------|
| 404 | `not_found` | "Resource not found" |
| 409 | `duplicate` | "Resource already exists" |

### Rate Limiting Errors

| Code | Type | Detail |
|------|------|--------|
| 429 | `rate_limit_exceeded` | "Rate limit exceeded. Retry after X seconds" |

### Internal Errors

| Code | Type | Detail |
|------|------|--------|
| 500 | `internal_error` | "An internal error occurred. Reference ID: {error_id}" |

## Debugging with Error IDs

All internal errors log the full exception with the error_id:

```python
logger.error(
    "Internal error",
    exc_info=True,
    extra={"error_id": error_id, "endpoint": request.url.path}
)
```

To trace an error:
1. Get `error_id` from response
2. Search logs: `grep {error_id} logs/*.log`
3. Find full stack trace and context

## Client Handling

```typescript
async function apiCall() {
  try {
    const response = await fetch('/api/v1/items');
    if (!response.ok) {
      const error = await response.json();

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        // Wait and retry
      } else if (response.status === 401) {
        // Redirect to login
      } else if (response.status >= 500) {
        // Show generic error with error_id
        console.error(`Server error: ${error.error_id}`);
      }
    }
  } catch (err) {
    // Network error
  }
}
```
