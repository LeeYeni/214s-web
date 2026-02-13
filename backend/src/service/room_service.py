from uuid import uuid4
from typing import Optional, List

from src.repository.room_repository import RoomRepository
from src.repository.message_repository import MessageRepository
from src.repository.event_repository import EventRepository
from src.schema.room import RoomResponse, DeleteRoomResponse, CheckRoomResponse

class RoomService:
    @staticmethod
    def create(
        user_id: int,
        message: str,
        key: Optional[str] = None,
        name: Optional[str] = None
    ) -> RoomResponse:
        """
        방을 1개 생성합니다.
        """
        key = key if key else str(uuid4())

        if not name:
            n_room = RoomRepository.count_by_user_id(user_id)
            name = f"room{n_room + 1}"
        
        new_room = RoomRepository.create(user_id, key, name)

        new_room_id = new_room.id
        MessageRepository.create(new_room_id, message)
        EventRepository.create(new_room_id)

        return RoomResponse(
            key=key,
            name=name,
            message=message,
            room_id=new_room_id,
            click=0
        )

    @staticmethod
    def delete(room_id: int) -> DeleteRoomResponse:
        """
        방을 1개 삭제합니다.
        """
        is_deleted = RoomRepository.delete(room_id)
        return DeleteRoomResponse(
            room_id=room_id,
            is_deleted=is_deleted
        )

    @staticmethod
    def get(user_id: int) -> List[RoomResponse]:
        """
        user_id를 기반으로 생성된 방을 모두 조회합니다.
        """
        rooms = RoomRepository.get_by_user_id(user_id)
        return [
            RoomResponse(
                key=r.key,
                name=r.name,
                message=r.message.message,
                room_id=r.id,
                click=r.event.click
            )
            for r in rooms
        ]

    @staticmethod
    def update(
        room_id: int,
        message: Optional[str] = None,
        key: Optional[str] = None,
        name: Optional[str] = None    
    ) -> RoomResponse:
        """
        room_id를 기반으로 방 정보를 업데이트합니다.
        """
        if key is not None or name is not None:
            RoomRepository.update(room_id, key, name)
        if message is not None:
            MessageRepository.update(room_id, message)

        room = RoomRepository.get_by_id(room_id)

        return RoomResponse(
            key=room.key,
            name=room.name,
            message=room.message.message,
            room_id=room_id,
            click=room.event.click
        )
    
    @staticmethod
    def check_key_availability(key: str) -> CheckRoomResponse:
        """
        key 중복 검사를 진행합니다.
        """
        is_exists = RoomRepository.exist_by_key(key)
        return CheckRoomResponse(is_available=not is_exists)