from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, func
from datetime import datetime
from typing import TYPE_CHECKING

from src.entity.base import Base
if TYPE_CHECKING:
    from src.entity.room import Room

class User(Base):
    __tablename__ = "user_table"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    provider_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    rooms: Mapped["Room"] = relationship(
        "Room",
        back_populates="user"
    )