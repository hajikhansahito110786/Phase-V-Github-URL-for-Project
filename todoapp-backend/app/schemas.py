
# Audit Log Schemas
class AuditLogBase(BaseModel):
    table_name: str
    record_id: int
    action: str
    old_data: Optional[Dict] = None
    new_data: Optional[Dict] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    changed_by: Optional[int] = None

class AuditLogResponse(AuditLogBase):
    id: int
    changed_by: Optional[int] = None
    changed_by_username: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Paginated Response
class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
