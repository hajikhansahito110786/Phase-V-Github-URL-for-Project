from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Import routers
from app.routers import auth, students, todos, chat, audit

app = FastAPI(title="Todo API", description="Todo Management System with Audit")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://148.230.88.136:3430"   # your dev frontend
                # alternative local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(todos.router, prefix="/api/todos", tags=["Todos"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
#app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(audit.router)  # No prefix, because the router already has it
@app.get("/")
async def root():
    return {
        "message": "Todo API is running",
        "endpoints": {
            "auth": "/api/auth",
            "students": "/api/students",
            "todos": "/api/todos",
            "chat": "/api/chat",
            "audit": "/api/audit",
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "backend"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8840))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
