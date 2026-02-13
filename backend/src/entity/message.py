from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, DateTime, func, ForeignKey
from typing import Optional, TYPE_CHECKING
from datetime import datetime

from src.entity.base import Base
if TYPE_CHECKING:
    from src.entity.room import Room

class Message(Base):
    __tablename__ = "message_table"

    id: Mapped[Integer] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    room_id: Mapped[int] = mapped_column(
        ForeignKey("room_table.id", ondelete="CASCADE"),
        unique=True
    )
    message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    room: Mapped["Room"] = relationship(
        "Room",
        back_populates="message"
    )