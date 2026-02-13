from pydantic import BaseModel
from typing import Optional

class RoomBase(BaseModel):
    key: str
    name: str
    message: str

class CreateRoomRequest(RoomBase):
    user_id: int
    key: Optional[str] = None
    name: Optional[str] = None

class UpdateRoomRequest(RoomBase):
    key: Optional[str] = None
    name: Optional[str] = None
    message: Optional[str] = None

class RoomResponse(RoomBase):
    room_id: int
    click: int

class DeleteRoomResponse(BaseModel):
    room_id: int
    is_deleted: bool

class CheckRoomResponse(BaseModel):
    is_available: bool