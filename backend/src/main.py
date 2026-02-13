from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
# import uvicorn

from src.entity.base import init_db
from src.api import user, message, room

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    yield

app = FastAPI(
    description="214s 웹 서버입니다.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://214s.yeni-lab.org"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user.router)
app.include_router(message.router)
app.include_router(room.router)

@app.get("/")
def read_root():
    return {"message": "214s 웹 서버에 오신 것을 환영합니다."}

# if __name__ == "__main__":
#     uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)