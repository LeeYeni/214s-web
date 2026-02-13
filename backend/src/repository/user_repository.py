from src.database.mysql import get_mysql_db
from src.entity.user import User

class UserRepository:
    @staticmethod
    def save(provider_id: str) -> User:
        """
        사용자 고유 ID를 저장합니다.
        """
        with get_mysql_db() as db:
            new_user = User(provider_id=provider_id)

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return new_user
        
    @staticmethod
    def find_by_provider_id(provider_id: str) -> User:
        """
        고유 ID를 기반으로 사용자를 조회합니다.
        """
        with get_mysql_db() as db:
            return db.query(User).filter(User.provider_id==provider_id).first()