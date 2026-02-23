#!/usr/bin/env python3
"""
Todo App Backend with JWT Authentication, Students, Todos, and Audit Logging
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os

# Import routers
from app.routers import auth, students, todos, chat, audit

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Todo API",
    description="Todo App with AI Chatbot and Audit Logging",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://148.230.88.136:3430", "http://localhost:3000", "http://localhost:3430"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(todos.router, prefix="/api/todos", tags=["Todos"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {
        "message": "Todo API is running",
        "status": "ok",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "auth": "/api/auth",
            "students": "/api/students",
            "todos": "/api/todos",
            "chat": "/api/chat",
            "audit": "/api/audit"
        }
    }

@app.get("/health")
async def health():
    logger.info("Health check called")
    return {
        "status": "healthy",
        "service": "backend",
        "timestamp": str(datetime.utcnow())
    }

@app.get("/api/health")
async def api_health():
    return {
        "status": "ok",
        "version": "1.0.0",
        "database": "connected"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8840))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
