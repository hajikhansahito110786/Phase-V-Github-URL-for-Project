'use client';

import { useState, useEffect } from 'react';
import { studentsApi, todosApi } from '@/lib/api';
import { Student, Todo } from '@/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function StudentsPage() {
  const { isAuthenticated } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewTodosModal, setViewTodosModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentTodos, setStudentTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  
  // Form state now matches API field names: email, phone (not student_email, student_phone)
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
    }
  }, [isAuthenticated]);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // For update, send only changed fields (allows partial updates)
        const updateData = {
          student_name: formData.student_name,
          student_email: formData.email,
          student_phone: formData.phone || undefined
        };
        const updated = await studentsApi.update(editingStudent.id, updateData);
        toast.success('Student updated');
        setStudents(students.map(s => s.id === updated.id ? updated : s));
      } else {
        // For create, send all required fields
        const createData = {
          student_name: formData.student_name,
          student_email: formData.email,
          student_phone: formData.phone || undefined
        };
        const created = await studentsApi.create(createData);
        toast.success('Student created');
        setStudents([...students, created]);
      }
      setModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This will also delete all todos for this student.')) return;
    try {
      await studentsApi.delete(id);
      toast.success('Student deleted');
      setStudents(students.filter(s => s.id !== id));
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const viewStudentTodos = async (student: Student) => {
  try {
    setSelectedStudent(student);
    setTodosLoading(true);
    const todos = await todosApi.getAll({ student_id: student.id }); // returns array directly
    setStudentTodos(todos || []);
    setViewTodosModal(true);
  } catch (error) {
    toast.error('Failed to load todos');
  } finally {
    setTodosLoading(false);
  }
};

  const resetForm = () => {
    setFormData({ student_name: '', email: '', phone: '' });
    setEditingStudent(null);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      student_name: student.student_name,
      email: student.email,
      phone: student.phone || ''
    });
    setModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <p>Please login to view students</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Students</h1>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          No students found. Click "Add Student" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{student.student_name}</h3>
                  <p className="text-gray-600 text-sm">{student.email}</p>
                  {student.phone && (
                    <p className="text-gray-500 text-sm mt-1">{student.phone}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewStudentTodos(student)}
                    className="text-green-500 hover:text-green-700"
                    title="View Todos"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(student)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Todos:</span>
                  <span className="font-semibold">{student.todo_count || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-yellow-600">
                    {student.pending_count || 0}
                  </span>
                </div>
                <Link
                  href={`/todos?student_id=${student.id}`}
                  className="block text-center mt-4 text-sm text-blue-500 hover:underline"
                >
                  View all todos for this student →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Todos Modal */}
      {viewTodosModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Todos for {selectedStudent.student_name}
              </h2>
              <button
                onClick={() => setViewTodosModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {todosLoading ? (
              <p className="text-center py-4">Loading todos...</p>
            ) : studentTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No todos for this student</p>
            ) : (
              <div className="space-y-3">
                {studentTodos.map((todo) => (
                  <div key={todo.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{todo.title}</h3>
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                        todo.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {todo.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Priority: {todo.priority}</span>
                      {todo.due_date && (
                        <span>Due: {new Date(todo.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link
                href={`/todos?student_id=${selectedStudent.id}`}
                className="text-blue-500 hover:underline"
                onClick={() => setViewTodosModal(false)}
              >
                View all in Todos page →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}