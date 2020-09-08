from fastapi import APIRouter

# from .utilities import build_cache

router = APIRouter()


@router.get("/")
async def index():
    # await build_cache()
    return {"message": "Hello, new index!"}
