from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.core.config import get_settings
from app.api.v1 import auth, parser

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend microservice for content parsing and auth",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up Session Middleware (Required for OAuth)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(parser.router, prefix=settings.API_V1_STR, tags=["parser"])

@app.get("/")
async def root():
    return {"message": "Kernel API is running"}

if __name__ == "__main__":
    import uvicorn
    # Note: Host and Port here are mainly for local non-docker run. 
    # Docker uses uvicorn main:app command directly.
    uvicorn.run(app, host="0.0.0.0", port=8888)

