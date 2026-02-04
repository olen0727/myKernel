from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import pytest
from main import app

client = TestClient(app)

def test_parse_url_success():
    """Test successful URL parsing"""
    mock_html = "<html><head><title>Test Title</title></head><body><article>Test content paragraph.</article></body></html>"
    mock_content = "Test content paragraph."
    
    # We mock the service layer or the library directly. 
    # Since we haven't written the service yet, we assume the code will use trafilatura.
    
    with patch("app.services.parser.trafilatura.fetch_url", return_value=mock_html):
        with patch("app.services.parser.trafilatura.extract", return_value=mock_content):
            # We also might mock extract_metadata if we use it, 
            # but let's assume we extract title/desc too.
            # actually trafilatura doesn't extract structure metadata easily in one go 
            # without bare_extraction or explicit calls.
            # Let's mock the Service method 'parse_url' directly if we want unit test isolation,
            # but for integration test (End-to-Endpoint), matching libs is better.
            
            # Let's mock the return of the service logic for a cleaner test of the Endpoint.
            # However, TDD implies we test the behavior.
            pass

    # Let's try mocking the libraries implementation path
    # Note: imports in the actual file must be mocked.
    # Since the file doesn't exist, we can't really "patch" it yet unless we define where it will be.
    # We will create 'app.services.parser' module.
    
    with patch("app.services.parser.trafilatura.fetch_url") as mock_fetch, \
         patch("app.services.parser.trafilatura.extract") as mock_extract, \
         patch("app.services.parser.trafilatura.extract_metadata") as mock_meta:
        
        mock_fetch.return_value = mock_html
        mock_extract.return_value = mock_content
        mock_meta.return_value = MagicMock(title="Test Title", description="Test Desc", image="http://img.com", sitename="Site")

        response = client.post(
            "/api/v1/parse-url",
            json={"url": "https://example.com/article"}
        )
        
        # We expect 200 OK
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Title"
        assert data["content"] == mock_content
        assert data["description"] == "Test Desc"

def test_parse_url_failure_fallback():
    """Test parse failure returns fallback data as per AC"""
    url = "https://example.com/404"
    
    with patch("app.services.parser.trafilatura.fetch_url", return_value=None): # Simulate network fail
        response = client.post(
            "/api/v1/parse-url",
            json={"url": url}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == url # Fallback to URL
        assert data["content"] == ""
