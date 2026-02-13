from typing import Optional

from src.database.mysql import get_mysql_db
from src.entity.message import Message

class MessageRepository:
    @staticmethod
    def create(room_id: int, message: str) -> None:
        """
        메시지를 추가합니다.
        """
        with get_mysql_db() as db:
            new_message = Message(room_id=room_id, message=message)

            db.add(new_message)
            db.commit()

    @staticmethod
    def update(room_id: int, content: Optional[str] = None) -> None:
        """
        메시지를 업데이트합니다.
        """
        with get_mysql_db() as db:
            message = db.query(Message).filter(Message.room_id==room_id).first()

            if content is not None:
                message.message = content

            db.commit()

    @staticmethod
    def get(room_id: int) -> Message:
        """
        room_id를 기반으로 메시지를 조회합니다.
        """
        with get_mysql_db() as db:
            return db.query(Message).filter(Message.room_id==room_id).first()