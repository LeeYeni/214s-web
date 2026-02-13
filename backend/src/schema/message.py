from pydantic import BaseModel
from typing import Optional

class MessageResponse(BaseModel):
    key: str
    message: Optional[str] = None