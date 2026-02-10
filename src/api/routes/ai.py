"""
AI/Chat API Routes
==================
Endpoints for interacting with Claude AI.
"""

import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from services.claude_service import get_claude_service, ClaudeService
from api.deps import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["AI"])


# --- Request/Response Models ---

class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    prompt: str = Field(..., min_length=1, max_length=10000, description="User's message")
    system: Optional[str] = Field(None, max_length=5000, description="Optional system prompt")
    temperature: float = Field(1.0, ge=0, le=2, description="Sampling temperature")
    model: Optional[str] = Field(None, description="Optional model override")


class ChatMessage(BaseModel):
    """Single chat message."""
    role: str = Field(..., pattern="^(user|assistant)$", description="Message role")
    content: str = Field(..., min_length=1, max_length=10000, description="Message content")


class ChatHistoryRequest(BaseModel):
    """Request model for chat with history."""
    messages: List[ChatMessage] = Field(..., min_items=1, max_items=50)
    system: Optional[str] = Field(None, max_length=5000)
    temperature: float = Field(1.0, ge=0, le=2)
    model: Optional[str] = Field(None)


class ChatResponse(BaseModel):
    """Response model for chat endpoints."""
    response: str = Field(..., description="Claude's response")
    model: str = Field(..., description="Model used")


# --- Endpoints ---

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
) -> ChatResponse:
    """
    Send a single message to Claude and get a response.

    Requires authentication. Rate limited.
    """
    try:
        claude = get_claude_service()

        response = await claude.chat_async(
            prompt=request.prompt,
            system=request.system,
            model=request.model,
            temperature=request.temperature
        )

        return ChatResponse(
            response=response,
            model=request.model or claude.model
        )

    except ValueError as e:
        logger.error(f"Claude API configuration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service is not properly configured"
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat request"
        )


@router.post("/chat/history", response_model=ChatResponse)
async def chat_with_history(
    request: ChatHistoryRequest,
    current_user: dict = Depends(get_current_user)
) -> ChatResponse:
    """
    Send a conversation history to Claude and get a response.

    Useful for multi-turn conversations where context matters.
    """
    try:
        claude = get_claude_service()

        # Convert Pydantic models to dicts for the API
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        response = await claude.chat_with_history_async(
            messages=messages,
            system=request.system,
            model=request.model,
            temperature=request.temperature
        )

        return ChatResponse(
            response=response,
            model=request.model or claude.model
        )

    except ValueError as e:
        logger.error(f"Claude API configuration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service is not properly configured"
        )
    except Exception as e:
        logger.error(f"Chat history endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat request"
        )


@router.get("/models")
async def list_models(current_user: dict = Depends(get_current_user)) -> dict:
    """
    List available Claude models.

    Returns the default model and other options.
    """
    return {
        "default": "claude-sonnet-4-5-20250929",
        "available": [
            "claude-opus-4-6",
            "claude-sonnet-4-5-20250929",
            "claude-haiku-4-5-20251001"
        ],
        "descriptions": {
            "claude-opus-4-6": "Most capable, best for complex tasks",
            "claude-sonnet-4-5-20250929": "Balanced performance and cost",
            "claude-haiku-4-5-20251001": "Fast and efficient for simple tasks"
        }
    }
