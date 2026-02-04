from pydantic import BaseModel, HttpUrl

class ParseUrlRequest(BaseModel):
    url: HttpUrl

class ParseUrlResponse(BaseModel):
    title: str
    description: str | None = None
    image: str | None = None
    content: str
    url: str
