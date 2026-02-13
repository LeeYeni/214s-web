from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

from src.api.dependency import get_user_service
from src.service.user_service import UserService
from src.schema.user import URLResponse

router = APIRouter(
    prefix="/api/user",
    tags=["User"]
)

@router.get("/url", response_model=URLResponse)
def get_url(service: UserService = Depends(get_user_service)):
    """
    카카오 url 로그인을 제공합니다.
    """
    return service.get_url()


@router.get("/login")
async def login(
    code: str,
    service: UserService = Depends(get_user_service)
):
    """
    카카오 로그인을 진행합니다.
    """
    redirect_url = await service.kakao_login(code)
    return RedirectResponse(url=redirect_url)