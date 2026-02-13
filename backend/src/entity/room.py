from sqlalchemy import Integer, DateTime, func, String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime
from typing import TYPE_CHECKING

from src.entity.base import Base
if TYPE_CHECKING:
    from src.entity.message import Message
    from src.entity.user import User
    from src.entity.event import Event

class Room(Base):
    __tablename__ = "room_table"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user_table.id")
    )
    key: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True,
        unique=True
    )
    name: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    message: Mapped["Message"] = relationship(
        "Message",
        back_populates="room",
        cascade="all, delete-orphan"
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="rooms"
    )
    event: Mapped["Event"] = relationship(
        "Event",
        back_populates="room",
        cascade="all, delete-orphan"
    )