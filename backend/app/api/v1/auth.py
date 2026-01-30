from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from app.core.config import get_settings
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth
import json

router = APIRouter()
settings = get_settings()

# Initialize OAuth (only if credentials exist, otherwise Mock)
oauth = OAuth()

if settings.GOOGLE_CLIENT_ID:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

# Mock DB for users
MOCK_USERS = {
    "mock_token": {
        "id": "mock-user-1",
        "email": "user@example.com",
        "name": "Mock User",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=mock"
    }
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

@router.get("/auth/google")
async def login_google(request: Request):
    if not settings.GOOGLE_CLIENT_ID:
        # Mock Mode
        redirect_uri = request.url_for('auth_google_callback')
        # Simulate Google redirecting back immediately
        return RedirectResponse(f"{redirect_uri}?code=mock_code")
    
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    if not settings.GOOGLE_CLIENT_ID:
        # Mock Mode
        token = "mock_token"
    else:
        # Real Mode
        try:
            token_data = await oauth.google.authorize_access_token(request)
            user_info = token_data.get('userinfo')
            # In a real app, you would create a JWT here based on user_info
            # For now, we just pass a dummy token or the access token
            token = "real_oauth_token_not_implemented_jwt" 
            # In real impl, we should store user in DB and issue our own JWT
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")

    # Redirect to frontend with token
    frontend_url = f"{settings.FRONTEND_URL}?token={token}"
    return RedirectResponse(url=frontend_url)

@router.get("/auth/github")
async def login_github(request: Request):
    # Mock for now regardless
    redirect_uri = request.url_for('auth_github_callback')
    return RedirectResponse(f"{redirect_uri}?code=mock_github_code")

@router.get("/auth/github/callback")
async def auth_github_callback(request: Request):
    token = "mock_token"
    frontend_url = f"{settings.FRONTEND_URL}?token={token}"
    return RedirectResponse(url=frontend_url)


# User Endpoints
@router.get("/api/v1/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    if token == "mock_token":
        return MOCK_USERS["mock_token"]
    
    # Simple validation for testing
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # If real token logic was here, we'd decode it.
    # Return mock for fallback
    return MOCK_USERS["mock_token"]
