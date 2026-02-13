from fastapi import APIRouter

from src.service.message_service import MessageService
from src.schema.message import MessageResponse

router = APIRouter(
    prefix="/api/message",
    tags=["Message"]
)

@router.get("/", response_model=MessageResponse)
def get_message(room_key: str):
    """
    수신자가 방에 들어와 메시지를 조회합니다.
    """
    return MessageService.get(room_key)