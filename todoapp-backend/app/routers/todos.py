from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Models
class Todo(BaseModel):
    id: int
    student_id: int
    title: str
    description: Optional[str] = None
    status: str  # pending, in_progress, completed, overdue
    priority: str  # low, medium, high, critical
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class TodoCreate(BaseModel):
    student_id: int
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None

class TodoUpdate(BaseModel):
    student_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None

class TodoStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    overdue: int
    high_priority: int

# Mock data
mock_todos = [
    {
        "id": 1,
        "student_id": 1,
        "title": "Complete project",
        "description": "Finish the todo app backend",
        "status": "pending",
        "priority": "high",
        "due_date": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

@router.get("/", response_model=List[Todo])
async def get_todos(
    student_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    filtered = mock_todos
    if student_id:
        filtered = [t for t in filtered if t["student_id"] == student_id]
    if status:
        filtered = [t for t in filtered if t["status"] == status]
    if priority:
        filtered = [t for t in filtered if t["priority"] == priority]
    return filtered[skip:skip+limit]
@router.get("/stats", response_model=TodoStats)
async def get_stats():
    total = len(mock_todos)
    pending = sum(1 for t in mock_todos if t["status"] == "pending")
    in_progress = sum(1 for t in mock_todos if t["status"] == "in_progress")
    completed = sum(1 for t in mock_todos if t["status"] == "completed")
    overdue = sum(1 for t in mock_todos if t.get("due_date") and t["due_date"] < datetime.utcnow())
    high_priority = sum(1 for t in mock_todos if t["priority"] in ("high", "critical"))
    return TodoStats(
        total=total,
        pending=pending,
        in_progress=in_progress,
        completed=completed,
        overdue=overdue,
        high_priority=high_priority
    )
@router.get("/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int):
    for t in mock_todos:
        if t["id"] == todo_id:
            return t
    raise HTTPException(status_code=404, detail="Todo not found")

@router.post("/", response_model=Todo)
async def create_todo(todo: TodoCreate):
    new_id = len(mock_todos) + 1
    new_todo = {
        "id": new_id,
        **todo.dict(),
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    mock_todos.append(new_todo)
    return new_todo

@router.put("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo: TodoUpdate):
    for i, t in enumerate(mock_todos):
        if t["id"] == todo_id:
            updated = t.copy()
            updated.update(todo.dict(exclude_unset=True))
            updated["updated_at"] = datetime.utcnow()
            mock_todos[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Todo not found")

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int):
    for i, t in enumerate(mock_todos):
        if t["id"] == todo_id:
            del mock_todos[i]
            return {"message": "Todo deleted"}
    raise HTTPException(status_code=404, detail="Todo not found")

@router.get("/stats", response_model=TodoStats)
async def get_stats():
    total = len(mock_todos)
    pending = sum(1 for t in mock_todos if t["status"] == "pending")
    in_progress = sum(1 for t in mock_todos if t["status"] == "in_progress")
    completed = sum(1 for t in mock_todos if t["status"] == "completed")
    overdue = sum(1 for t in mock_todos if t.get("due_date") and t["due_date"] < datetime.utcnow())
    high_priority = sum(1 for t in mock_todos if t["priority"] in ("high", "critical"))
    return TodoStats(
        total=total,
        pending=pending,
        in_progress=in_progress,
        completed=completed,
        overdue=overdue,
        high_priority=high_priority
    )
