import trafilatura
from app.models.parser import ParseUrlResponse

def parse_url(url: str) -> ParseUrlResponse:
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded is None:
             # Fallback
             return ParseUrlResponse(
                 title=url,
                 content="",
                 url=url,
                 description=None,
                 image=None
             )
        
        # Extract content
        content = trafilatura.extract(
            downloaded,
            include_formatting=True,
            include_links=True,
            include_images=True
        ) or ""
        
        # Extract metadata
        metadata = trafilatura.extract_metadata(downloaded)
        
        title = url
        description = None
        image = None
        
        if metadata:
            title = metadata.title if metadata.title else url
            description = metadata.description
            image = metadata.image
            
        return ParseUrlResponse(
            title=title,
            description=description,
            image=image,
            content=content,
            url=url
        )
            
    except Exception as e:
        # Fallback on error
        return ParseUrlResponse(
            title=url,
            content="",
            url=url
        )
