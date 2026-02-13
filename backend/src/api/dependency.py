from src.service.user_service import UserService

# 싱글톤 인스턴스
user_service = UserService()

def get_user_service() -> UserService:
    return user_service