from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSON  # or use Text for simplicity
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = 'users100'

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)   # hashed
    role = Column(String(50), default='user')
    created_at = Column(DateTime, default=datetime.utcnow)

class Student(Base):
    __tablename__ = 'students100'

    id = Column(Integer, primary_key=True)
    student_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Todo(Base):
    __tablename__ = 'todo100'

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students100.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default='pending')
    priority = Column(String(50), default='medium')
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = 'audit_log100'

    id = Column(Integer, primary_key=True)
    table_name = Column(String(100), nullable=False)
    record_id = Column(Integer, nullable=False)
    action = Column(String(50), nullable=False)  # INSERT, UPDATE, DELETE
    old_data = Column(JSON, nullable=True)       # or use Text to store JSON string
    new_data = Column(JSON, nullable=True)
    changed_by = Column(Integer, ForeignKey('users100.id'), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 ready
    created_at = Column(DateTime, default=datetime.utcnow)