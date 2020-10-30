from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def index():
    # await build_cache()
    return {"message": "Hello, new index!"}
