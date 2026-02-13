from sqlalchemy.orm import declarative_base
from src.database.mysql import engine

Base = declarative_base()

def init_db():
    from src.entity import room, message, user, event
    Base.metadata.create_all(bind=engine)