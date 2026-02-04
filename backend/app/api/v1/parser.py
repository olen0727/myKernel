from fastapi import APIRouter
from app.models.parser import ParseUrlRequest, ParseUrlResponse
from app.services import parser as parser_service

router = APIRouter()

@router.post("/parse-url", response_model=ParseUrlResponse)
async def parse_url_endpoint(request: ParseUrlRequest):
    url_str = str(request.url)
    return parser_service.parse_url(url_str)
