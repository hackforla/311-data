from fastapi import APIRouter

from .utilities import build_cache
from ..config import cache

router = APIRouter()


@router.get("/")
async def index():
    await build_cache()
    return cache
