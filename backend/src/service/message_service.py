from src.repository.message_repository import MessageRepository
from src.repository.room_repository import RoomRepository
from src.repository.event_repository import EventRepository
from src.schema.message import MessageResponse

class MessageService:
    @staticmethod
    def get(key: str) -> MessageResponse:
        """
        key를 기반으로 메시지를 조회하고, click 횟수를 1 증가합니다.
        """
        room = RoomRepository.get_by_key(key)
        room_id = room.id

        message = MessageRepository.get(room_id)
        EventRepository.update(room_id)

        return MessageResponse(key=key, message=message.message)