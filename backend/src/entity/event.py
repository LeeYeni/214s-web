from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, DateTime, func, ForeignKey
from datetime import datetime
from typing import TYPE_CHECKING

from src.entity.base import Base
if TYPE_CHECKING:
    from src.entity.room import Room

class Event(Base):
    __tablename__ = "event_table"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    room_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("room_table.id", ondelete="CASCADE"),
        index=True
    )
    click: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
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
        back_populates="event"
    )