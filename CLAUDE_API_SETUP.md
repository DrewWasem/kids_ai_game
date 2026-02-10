# Claude API Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install the `anthropic` SDK and all other dependencies.

### 2. Get Your API Key

1. Go to https://console.anthropic.com/
2. Navigate to API Keys
3. Create a new API key
4. Copy the key (it starts with `sk-ant-`)

### 3. Configure Environment

Add to your `.env` file:

```bash
# Claude API Configuration
MYAPP_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
MYAPP_ANTHROPIC_MODEL=claude-sonnet-4-5-20250929  # Optional, defaults to Sonnet 4.5
MYAPP_ANTHROPIC_MAX_TOKENS=4096                   # Optional, defaults to 4096
```

### 4. Start Your Application

```bash
python3 monitor.py --start-all
```

Your API will be available at http://localhost:8001

## API Endpoints

### POST /api/ai/chat

Send a single message to Claude:

```bash
curl -X POST http://localhost:8001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "temperature": 0.7
  }'
```

Response:
```json
{
  "response": "Claude's response here...",
  "model": "claude-sonnet-4-5-20250929"
}
```

### POST /api/ai/chat/history

Send a conversation with history:

```bash
curl -X POST http://localhost:8001/api/ai/chat/history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is 2+2?"},
      {"role": "assistant", "content": "4"},
      {"role": "user", "content": "What about 2+3?"}
    ],
    "temperature": 0.7
  }'
```

### GET /api/ai/models

List available Claude models:

```bash
curl http://localhost:8001/api/ai/models \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Usage in Code

### Simple Chat

```python
from services.claude_service import get_claude_service

claude = get_claude_service()
response = await claude.chat_async(
    prompt="Write a haiku about programming",
    temperature=0.7
)
print(response)
```

### With System Prompt

```python
response = await claude.chat_async(
    prompt="What's the capital of France?",
    system="You are a geography teacher. Keep answers brief and educational.",
    temperature=0.3
)
```

### Multi-turn Conversation

```python
messages = [
    {"role": "user", "content": "Tell me a joke"},
    {"role": "assistant", "content": "Why do programmers prefer dark mode? Because light attracts bugs!"},
    {"role": "user", "content": "Tell me another one"}
]

response = await claude.chat_with_history_async(messages)
```

## Available Models

| Model | ID | Best For |
|-------|-----|----------|
| **Opus 4.6** | `claude-opus-4-6` | Complex reasoning, research, analysis |
| **Sonnet 4.5** | `claude-sonnet-4-5-20250929` | Balanced performance (default) |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Fast responses, simple tasks |

## Cost Management

To minimize costs:

1. **Use appropriate models**: Haiku for simple tasks, Opus only when needed
2. **Set max_tokens**: Lower values = lower cost
3. **Cache system prompts**: Reuse system prompts across requests
4. **Monitor usage**: Check your Anthropic console regularly

Example with cost optimization:

```python
# For simple tasks - use Haiku
response = await claude.chat_async(
    prompt="Summarize this in 3 words: 'The weather is nice'",
    model="claude-haiku-4-5-20251001",
    max_tokens=10
)

# For complex tasks - use Opus
response = await claude.chat_async(
    prompt="Analyze this complex financial report...",
    model="claude-opus-4-6",
    max_tokens=4096
)
```

## Testing

Test the service without starting the full app:

```python
# Create test file: test_claude.py
import asyncio
from services.claude_service import ClaudeService

async def test():
    claude = ClaudeService()
    response = await claude.chat_async(
        prompt="Hello, Claude!",
        system="You are a friendly assistant."
    )
    print(response)

asyncio.run(test())
```

Run it:
```bash
cd src
MYAPP_ANTHROPIC_API_KEY="sk-ant-your-key" python test_claude.py
```

## Troubleshooting

### "API key is required" Error

Make sure `MYAPP_ANTHROPIC_API_KEY` is set in your `.env` file.

### Rate Limits

Anthropic has rate limits based on your plan:
- Free tier: Lower limits
- Paid tier: Higher limits

If you hit limits, implement retry logic with exponential backoff.

### Authentication Required

All `/api/ai/*` endpoints require authentication. Get a JWT token first:

```bash
# Login
curl -X POST http://localhost:8001/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=your_user&password=your_pass"
```

Use the returned `access_token` in subsequent requests.

## Need Help?

- Anthropic API Docs: https://docs.anthropic.com/
- API Console: https://console.anthropic.com/
- Support: https://support.anthropic.com/
