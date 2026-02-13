from sqlalchemy import func
from sqlalchemy.orm import joinedload
from typing import List, Optional

from src.entity.room import Room
from src.entity.message import Message
from src.entity.event import Event
from src.database.mysql import get_mysql_db

class RoomRepository:
    @staticmethod
    def create(user_id: str, key: str, name: str) -> Room:
        """
        방 1개를 생성합니다.
        """
        with get_mysql_db() as db:
            new_room = Room(user_id=user_id, key=key, name=name)

            db.add(new_room)
            db.commit()
            db.refresh(new_room)

            return new_room
        
    @staticmethod
    def delete(id: int) -> bool:
        """
        방 1개를 삭제합니다.
        """
        with get_mysql_db() as db:
            room = db.query(Room).filter(Room.id==id).first()

            if room:
                db.delete(room)
                db.commit()
                return True
            return False
        
    @staticmethod
    def count_by_user_id(user_id: int) -> int:
        """
        user_id를 기반으로 방 개수를 반환합니다.
        """
        with get_mysql_db() as db:
            return db.query(func.count(Room.id)).filter(Room.user_id==user_id).scalar()
        
    @staticmethod
    def get_by_user_id(user_id: int) -> List[Room]:
        """
        user_id를 기반으로 생성된 모든 방을 조회합니다.
        """
        with get_mysql_db() as db:
            return (
                db.query(Room)
                .options(joinedload(Room.message))
                .options(joinedload(Room.event))
                .filter(Room.user_id==user_id)
                .all()
            )
        
    @staticmethod
    def get_by_id(id: int) -> Room:
        """
        room_id를 기반으로 특정 방을 조회합니다.
        """
        with get_mysql_db() as db:
            return (
                db.query(Room)
                .options(joinedload(Room.message))
                .options(joinedload(Room.event))
                .filter(Room.id==id)
                .first()
            )
        
    @staticmethod
    def update(id: int, key: Optional[str] = None, name: Optional[str] = None) -> None:
        """
        방 정보를 업데이트합니다.
        """
        with get_mysql_db() as db:
            room = db.query(Room).filter(Room.id==id).first()

            if key is not None:
                room.key = key
            if name is not None:
                room.name = name

            db.commit()

    @staticmethod
    def get_by_key(key: str) -> Room:
        """
        key를 기반으로 room 엔티티를 반환합니다.
        """
        with get_mysql_db() as db:
            return db.query(Room).filter(Room.key==key).first()
        
    @staticmethod
    def exist_by_key(key: str) -> bool:
        """
        key 중복 검사를 진행합니다.
        """
        with get_mysql_db() as db:
            room = db.query(Room).filter(Room.key==key).first()
            return room is not None