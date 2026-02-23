// User type
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

// Student type – must match the API response (field name: student_name)
export interface Student {
  id: number;
  student_name: string;   // matches the API and dashboard usage
  email: string;
  phone?: string;
  created_at?: string;     // optional, if your API returns it
  updated_at?: string;     // optional, if your API returns it
  todo_count?: number;    // <-- add this
  pending_count?: number; 

}

// Todo type – includes student_id for lookup
export interface Todo {
  id: number;
  student_id: number;      // added for student lookup
  title: string;
  description?: string;    // optional
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'; // union type for safety
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;       // optional date string
  created_at: string;
  updated_at: string;
}

// AuditLog type – adjust field names to match your API response
export interface AuditLog {
  id: number;
  table_name: string;      // likely 'table_name' (as used in dashboard)
  action: string;          // 'INSERT', 'UPDATE', 'DELETE'
  record_id: number;
  changed_by: number;      // user ID
  changed_by_username?: string; // username, if included
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  created_at: string;      // timestamp
}

// API response types (if needed)
export interface LoginResponse {
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Todo stats type
export interface TodoStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
  high_priority?: number;   // optional, if your API includes it
}

// Credentials and registration
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Create/update types
export interface StudentCreate {
  student_name: string;
  email: string;
  phone?: string;
}

export interface StudentUpdate extends Partial<StudentCreate> {}

export interface TodoCreate {
  student_id: number;
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
}

export interface TodoUpdate extends Partial<TodoCreate> {}

// Chat message type
export interface ChatMessage {
  id?: number;
  user_id?: number;
  message: string;
  response: string;
  created_at?: string;
}
