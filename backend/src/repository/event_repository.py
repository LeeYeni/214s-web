from src.database.mysql import get_mysql_db
from src.entity.event import Event

class EventRepository:
    @staticmethod
    def create(room_id: int) -> None:
        """
        클릭 이벤트를 생성합니다.
        """
        with get_mysql_db() as db:
            new_event = Event(room_id=room_id)

            db.add(new_event)
            db.commit()

    @staticmethod
    def update(room_id: int) -> None:
        """
        클릭 횟수를 업데이트합니다.
        """
        with get_mysql_db() as db:
            event = db.query(Event).filter(Event.room_id==room_id).first()

            event.click += 1
            db.commit()