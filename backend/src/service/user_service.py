import os, httpx
from dotenv import load_dotenv

from src.repository.user_repository import UserRepository
from src.schema.user import URLResponse

load_dotenv()

class UserService:
    def __init__(self):
        self.client_id = os.getenv("KAKAO_REST_API")
        self.redirect_uri = os.getenv("KAKAO_REDIRECT_URI")

        self.auth_url = "https://kauth.kakao.com/oauth/authorize"
        self.token_url = "https://kauth.kakao.com/oauth/token"
        self.user_info_url = "https://kapi.kakao.com/v2/user/me"

        self.frontend_url = os.getenv("FRONTEND_URL")

    def get_url(self) -> URLResponse:
        """
        인가 URL을 생성합니다.
        """
        url = f"{self.auth_url}?client_id={self.client_id}&redirect_uri={self.redirect_uri}&response_type=code"
        return URLResponse(url=url)
    
    async def kakao_login(self, code: str):
        """
        카카오 로그인을 진행합니다.
        """
        access_token = await self.get_kakao_token(code)
        provider_id = await self.get_provider_id(access_token)

        user = UserRepository.find_by_provider_id(provider_id)

        if not user:
            user = UserRepository.save(provider_id)

        redirect_url = f"{self.frontend_url}/home/{user.id}"

        return redirect_url

    async def get_kakao_token(self, code: str) -> str:
        """
        전달받은 code로 Access Token을 발급받습니다.        
        """
        data = {
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "code": code,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.token_url, data=data)

            print(f"DEBUG: 토큰 발급 응답 -> {response.json()}")
            return response.json().get("access_token")
        
    async def get_provider_id(self, access_token: str) -> str:
        """
        Access Token을 이용해 카카오의 고유 회원 번호를 가져옵니다.
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.user_info_url, headers=headers)
            user_info = response.json()

            print(f"DEBUG: 카카오 전체 응답 -> {user_info}")
            print(f"DEBUG: 상태 코드 -> {response.status_code}")

            return str(user_info.get("id"))
