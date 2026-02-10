"""
Claude API Service
==================
Service for interacting with the Anthropic Claude API.
"""

import logging
from typing import Optional, List, Dict, Any
from anthropic import Anthropic, AsyncAnthropic
from anthropic.types import Message

from config import config

logger = logging.getLogger(__name__)


class ClaudeService:
    """Service for interacting with Claude API."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Claude service.

        Args:
            api_key: Optional API key override. If not provided, uses config.ANTHROPIC_API_KEY
        """
        self.api_key = api_key or config.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("Anthropic API key is required. Set MYAPP_ANTHROPIC_API_KEY environment variable.")

        self.client = Anthropic(api_key=self.api_key)
        self.async_client = AsyncAnthropic(api_key=self.api_key)
        self.model = config.ANTHROPIC_MODEL
        self.max_tokens = config.ANTHROPIC_MAX_TOKENS

    def chat(
        self,
        prompt: str,
        system: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 1.0,
    ) -> str:
        """
        Send a synchronous chat request to Claude.

        Args:
            prompt: The user's message/prompt
            system: Optional system prompt to set context
            model: Optional model override (default: from config)
            max_tokens: Optional max tokens override (default: from config)
            temperature: Sampling temperature (0-1)

        Returns:
            Claude's response as a string
        """
        try:
            message = self.client.messages.create(
                model=model or self.model,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature,
                system=system or "",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract text content from response
            return message.content[0].text if message.content else ""

        except Exception as e:
            logger.error(f"Claude API error: {e}")
            raise

    async def chat_async(
        self,
        prompt: str,
        system: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 1.0,
    ) -> str:
        """
        Send an asynchronous chat request to Claude.

        Args:
            prompt: The user's message/prompt
            system: Optional system prompt to set context
            model: Optional model override (default: from config)
            max_tokens: Optional max tokens override (default: from config)
            temperature: Sampling temperature (0-1)

        Returns:
            Claude's response as a string
        """
        try:
            message = await self.async_client.messages.create(
                model=model or self.model,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature,
                system=system or "",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            return message.content[0].text if message.content else ""

        except Exception as e:
            logger.error(f"Claude API error: {e}")
            raise

    def chat_with_history(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 1.0,
    ) -> str:
        """
        Send a chat request with conversation history.

        Args:
            messages: List of message dicts with 'role' and 'content' keys
                     Example: [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi!"}]
            system: Optional system prompt
            model: Optional model override
            max_tokens: Optional max tokens override
            temperature: Sampling temperature (0-1)

        Returns:
            Claude's response as a string
        """
        try:
            message = self.client.messages.create(
                model=model or self.model,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature,
                system=system or "",
                messages=messages
            )

            return message.content[0].text if message.content else ""

        except Exception as e:
            logger.error(f"Claude API error: {e}")
            raise

    async def chat_with_history_async(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 1.0,
    ) -> str:
        """
        Send an async chat request with conversation history.

        Args:
            messages: List of message dicts with 'role' and 'content' keys
            system: Optional system prompt
            model: Optional model override
            max_tokens: Optional max tokens override
            temperature: Sampling temperature (0-1)

        Returns:
            Claude's response as a string
        """
        try:
            message = await self.async_client.messages.create(
                model=model or self.model,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature,
                system=system or "",
                messages=messages
            )

            return message.content[0].text if message.content else ""

        except Exception as e:
            logger.error(f"Claude API error: {e}")
            raise


# Singleton instance for easy imports
_claude_service: Optional[ClaudeService] = None


def get_claude_service() -> ClaudeService:
    """Get or create the Claude service singleton."""
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service
