from fastapi import APIRouter
from typing import List

from src.schema.room import (
    RoomResponse,
    DeleteRoomResponse,
    CreateRoomRequest,
    UpdateRoomRequest,
    CheckRoomResponse
)
from src.service.room_service import RoomService

router = APIRouter(
    prefix="/api/room",
    tags=["Room"]
)

@router.post("/", response_model=RoomResponse)
def create_room(request: CreateRoomRequest):
    """
    방을 생성합니다.
    """
    return RoomService.create(request.user_id, request.message, request.key, request.name)

@router.get("/", response_model=List[RoomResponse])
def get_room(user_id: int):
    """
    사용자가 생성한 방 목록을 조회합니다.
    """
    return RoomService.get(user_id)

@router.patch("/{room_id}", response_model=RoomResponse)
def update_room(room_id: int, request: UpdateRoomRequest):
    """
    방 이름, 패스워드, 메시지를 수정합니다.
    """
    return RoomService.update(room_id, request.message, request.key, request.name)

@router.delete("/{id}", response_model=DeleteRoomResponse)
def delete_room(id: int):
    """
    방을 삭제합니다.
    """
    return RoomService.delete(id)

@router.get("/check-key", response_model=CheckRoomResponse)
def check_key_availablity(key: str):
    """
    키 중복 검사를 진행합니다.
    """
    return RoomService.check_key_availability(key)