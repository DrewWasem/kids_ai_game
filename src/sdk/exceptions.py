"""
SDK Exceptions
==============
"""


class AppError(Exception):
    """Base exception for SDK errors."""
    pass


class APIError(AppError):
    """API returned an error response."""
    def __init__(self, message: str, status_code: int = 0):
        super().__init__(message)
        self.status_code = status_code


class AuthenticationError(AppError):
    """Authentication failed."""
    pass


class NotFoundError(AppError):
    """Resource not found."""
    pass


class RateLimitError(AppError):
    """Rate limit exceeded."""
    def __init__(self, message: str, retry_after: int = 0):
        super().__init__(message)
        self.retry_after = retry_after
