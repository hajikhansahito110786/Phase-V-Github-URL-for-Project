from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Models
class Student(BaseModel):
    id: int
    user_id: int
    student_name: str
    email: str
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class StudentCreate(BaseModel):
    student_name: str
    email: str
    phone: Optional[str] = None

class StudentUpdate(BaseModel):
    student_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

# Mock database
mock_students = [
    {
        "id": 1,
        "user_id": 1,
        "student_name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

@router.get("/", response_model=List[Student])
async def get_students():
    return mock_students

@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: int):
    for s in mock_students:
        if s["id"] == student_id:
            return s
    raise HTTPException(status_code=404, detail="Student not found")

@router.post("/", response_model=Student)
async def create_student(student: StudentCreate):
    new_id = len(mock_students) + 1
    new_student = {
        "id": new_id,
        "user_id": 1,
        **student.dict(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    mock_students.append(new_student)
    return new_student

@router.put("/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentUpdate):
    for i, s in enumerate(mock_students):
        if s["id"] == student_id:
            updated = s.copy()
            updated.update(student.dict(exclude_unset=True))
            updated["updated_at"] = datetime.utcnow()
            mock_students[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Student not found")

@router.delete("/{student_id}")
async def delete_student(student_id: int):
    for i, s in enumerate(mock_students):
        if s["id"] == student_id:
            del mock_students[i]
            return {"message": "Student deleted"}
    raise HTTPException(status_code=404, detail="Student not found")
