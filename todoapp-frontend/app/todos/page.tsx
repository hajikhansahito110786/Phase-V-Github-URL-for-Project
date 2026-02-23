'use client';

import { useState, useEffect } from 'react';
import { todosApi, studentsApi } from '@/lib/api';
import { Todo, Student } from '@/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function TodosPage() {
  const { isAuthenticated } = useAuthStore();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filters, setFilters] = useState({
    student_id: '',
    status: '',
    priority: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0
  });
  
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    due_date: ''
  });

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadStats();
    }
  }, [isAuthenticated, filters]);

  const loadData = async () => {
    try {
      const [todosData, studentsData] = await Promise.all([
        todosApi.getAll(filters),
        studentsApi.getAll()
      ]);
      //setTodos(todosData.todos || []);
      setTodos(todosData); // todosData is already the array
      setStudents(studentsData);
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await todosApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare data with correct types
      const todoData = {
        student_id: parseInt(formData.student_id, 10), // convert string → number
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date || undefined
      };

      if (editingTodo) {
        const updated = await todosApi.update(editingTodo.id, todoData);
        toast.success('Todo updated');
        setTodos(todos.map(t => t.id === updated.id ? updated : t));
      } else {
        const created = await todosApi.create(todoData);
        toast.success('Todo created');
        setTodos([created, ...todos]);
      }
      setModalOpen(false);
      resetForm();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this todo?')) return;
    try {
      await todosApi.delete(id);
      toast.success('Todo deleted');
      setTodos(todos.filter(t => t.id !== id));
      loadStats();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // ✅ FIXED: Type the status parameter properly
  const handleStatusChange = async (todo: Todo, newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      const updated = await todosApi.update(todo.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
      loadStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      due_date: ''
    });
    setEditingTodo(null);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      student_id: todo.student_id.toString(),
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      // Map 'overdue' to 'pending' because the form doesn't have an 'overdue' option
      status: todo.status === 'overdue' ? 'pending' : todo.status,
      due_date: todo.due_date ? todo.due_date.split('T')[0] : ''
    });
   setModalOpen(true);
 };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'overdue': return <ClockIcon className="h-5 w-5 text-red-500" />;
      default: return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setFilters({ student_id: '', status: '', priority: '' });
  };

  if (!isAuthenticated) {
    return <div className="text-center py-10">Please login to view todos</div>;
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Todo Management</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-yellow-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-blue-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">{stats.in_progress}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-green-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-red-600 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
          </div>
        </div>

        {/* Filter bar and add button */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5" />
            Add Todo
          </button>

          <div className="flex gap-2 items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.student_id}
              onChange={(e) => setFilters({...filters, student_id: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Students</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.student_name}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {(filters.student_id || filters.status || filters.priority) && (
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
                title="Clear filters"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Todo list */}
      <div className="bg-white rounded-lg shadow divide-y">
        {todos.map((todo) => (
          <div key={todo.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(todo.status)}
                  <h3 className="font-semibold text-lg">{todo.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                </div>
                {todo.description && (
                  <p className="text-gray-600 mb-2">{todo.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Student: <span className="font-medium">
                    {students.find(s => s.id === todo.student_id)?.student_name || 'Unknown'}
                  </span></span>
                  {todo.due_date && (
                    <span>Due: <span className="font-medium">{new Date(todo.due_date).toLocaleDateString()}</span></span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-3">
                  Updated: {new Date(todo.updated_at).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <select
                  value={todo.status}
                  // ✅ FIXED: cast the value to the expected union type
                  onChange={(e) => handleStatusChange(todo, e.target.value as 'pending' | 'in_progress' | 'completed')}
                  className="border rounded-lg px-2 py-1 text-sm bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => openEditModal(todo)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No todos found. Click "Add Todo" to create one.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTodo ? 'Edit Todo' : 'Create Todo'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select a student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.student_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                {editingTodo && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingTodo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}