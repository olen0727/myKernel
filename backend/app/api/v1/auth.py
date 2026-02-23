from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from app.core.config import get_settings
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.services.couchdb import ensure_user_databases

router = APIRouter()
settings = get_settings()

# JWT Config
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Initialize OAuth
oauth = OAuth()

if settings.GOOGLE_CLIENT_ID:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.get("/auth/google")
async def login_google(request: Request):
    print("DEBUG: login_google endpoint hit!")
    redirect_uri = str(request.url_for('auth_google_callback'))
    if "seckernel.com" in redirect_uri:
        redirect_uri = redirect_uri.replace("http://", "https://")
        
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")
    
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")

    try:
        token_data = await oauth.google.authorize_access_token(request)
        user_info = token_data.get('userinfo')
        if not user_info:
            raise ValueError("No user info returned")
        # Ensure we capture name and picture
        user_data = {
            "sub": user_info['sub'], 
            "email": user_info['email'], 
            "name": user_info.get('name'), 
            "picture": user_info.get('picture')
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")



    # Ensure User DBs exist
    try:
        ensure_user_databases(user_data["sub"])
    except Exception as db_err:
        print(f"ERROR: Failed to ensure user databases: {str(db_err)}")
        # We continue even if DB creation fails so user can at least be authenticated, 
        # but the frontend will likely show 404s until fixed.

    # Generate JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data=user_data, expires_delta=access_token_expires
    )

    # Redirect to frontend with REAL JWT (Fragment based)
    frontend_url = f"{settings.FRONTEND_URL}/#token={access_token}"
    return RedirectResponse(url=frontend_url)

@router.get("/auth/github")
async def login_github(request: Request):
    # Github flow similar structure (Mock for now)
    redirect_uri = request.url_for('auth_github_callback')
    return RedirectResponse(f"{redirect_uri}?code=mock_github_code")

@router.get("/auth/github/callback")
async def auth_github_callback(request: Request):
    # Mock user for GitHub
    user_data = {"sub": "github-user-1", "email": "github@example.com"}
    
    # Ensure User DBs exist
    ensure_user_databases(user_data["sub"])

    access_token = create_access_token(
        data=user_data, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    frontend_url = f"{settings.FRONTEND_URL}#token={access_token}"
    return RedirectResponse(url=frontend_url)

@router.get("/api/v1/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
             raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Return data from JWT stamps (Real User Info)
        return {
            "id": user_id,
            "email": payload.get("email"),
            "name": payload.get("name") or "User",
            "avatarUrl": payload.get("picture"),
            "plan": "founder" # Default 
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

