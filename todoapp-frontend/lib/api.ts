import axios from 'axios';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  Student, 
  StudentCreate,
  StudentUpdate,
  Todo, 
  TodoCreate,
  TodoUpdate,
  TodoStats, 
  ChatMessage, 
  AuditLog,
  PaginatedResponse 
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://148.230.88.136:8840';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<{ user: User }> => {
    const res = await api.post('/api/auth/login', { username, password });
    return res.data;
  },
  register: async (data: RegisterData): Promise<User> => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
  verify: async (): Promise<{ user: User }> => {
    const res = await api.get('/api/auth/verify');
    return res.data;
  }
};

// Students API
export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await api.get('/api/students');
    return res.data;
  },
  getById: async (id: number): Promise<Student> => {
    const res = await api.get(`/api/students/${id}`);
    return res.data;
  },
  create: async (data: StudentCreate): Promise<Student> => {
    const res = await api.post('/api/students', data);
    return res.data;
  },
  update: async (id: number, data: StudentUpdate): Promise<Student> => {
    const res = await api.put(`/api/students/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/students/${id}`);
  }
};

// Todos API
export const todosApi = {
  getAll: async (params?: any): Promise<Todo[]> => {
  const cleanedParams = params ? Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v != null)
  ) : undefined;
  const res = await api.get('/api/todos', { params: cleanedParams });
  return res.data;  // res.data is the array
},
  getById: async (id: number): Promise<Todo> => {
    const res = await api.get(`/api/todos/${id}`);
    return res.data;
  },
  create: async (data: TodoCreate): Promise<Todo> => {
    const res = await api.post('/api/todos', data);
    return res.data;
  },
  update: async (id: number, data: TodoUpdate): Promise<Todo> => {
    const res = await api.put(`/api/todos/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/todos/${id}`);
  },
  getStats: async (): Promise<TodoStats> => {
    const res = await api.get('/api/todos/stats');
    return res.data;
  }
};

// Chat API
export const chatApi = {
  sendMessage: async (message: string): Promise<{ response: string }> => {
    const res = await api.post('/api/chat', { message });
    return res.data;
  }
};

// Audit Logs API
export const auditApi = {
  getAll: async (params?: any): Promise<PaginatedResponse<AuditLog>> => {
    const cleanedParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v != null)
    ) : undefined;
    const res = await api.get('/api/audit', { params: cleanedParams });
    return res.data;
  },
  getByTable: async (table: string, recordId: number): Promise<AuditLog[]> => {
    const res = await api.get(`/api/audit/table/${table}/${recordId}`);
    return res.data;
  }
};
