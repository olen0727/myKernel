import trafilatura
from app.models.parser import ParseUrlResponse
from readability import Document
from markdownify import markdownify as md

def parse_url(url: str) -> ParseUrlResponse:
    try:
        # Use trafilatura for robust fetching (handles headers, compression etc)
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
        
        # 1. Extract Metadata using Trafilatura (it's good at this)
        metadata = trafilatura.extract_metadata(downloaded)
        
        title = url
        description = None
        image = None
        
        if metadata:
            title = metadata.title if metadata.title else url
            description = metadata.description
            image = metadata.image

        # 2. Extract Main Content using Readability (better structure preservation)
        doc = Document(downloaded)
        # summary() gives the HTML of the main article content
        article_html = doc.summary() 
        
        # 3. Convert to Markdown using Markdownify (supports H1-H3, Images, formatting)
        # We specify heading_style="atx" to get # Heading instead of underlined
        content = md(
            article_html, 
            heading_style="atx", 
            strip=["script", "style"],
            strong_em_symbol="**"
        )
        
        # Fallback if readability fails
        if not content.strip():
             content = trafilatura.extract(
                downloaded,
                include_formatting=True,
                include_links=True,
                include_images=True
            ) or ""
            
        return ParseUrlResponse(
            title=title,
            description=description,
            image=image,
            content=content,
            url=url
        )
            
    except Exception as e:
        print(f"Error parsing url {url}: {e}")
        # Fallback on error
        return ParseUrlResponse(
            title=url,
            content="",
            url=url
        )

