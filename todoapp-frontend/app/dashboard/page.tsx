'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { todosApi, studentsApi, auditApi } from '@/lib/api';
import { Todo, Student, AuditLog } from '@/types';
import Link from 'next/link';

import { 
  ClipboardDocumentListIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    high_priority: 0
  });
  const [recentTodos, setRecentTodos] = useState<Todo[]>([]);
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      const [statsData, todosData, studentsData, auditData] = await Promise.all([
        todosApi.getStats(),
        todosApi.getAll({ limit: 5 }),
        studentsApi.getAll(),
        auditApi.getAll({ limit: 5 })
      ]);
      
      // Fix: provide defaults for each stat field, especially high_priority which might be undefined
      setStats({
        total: statsData?.total ?? 0,
        pending: statsData?.pending ?? 0,
        in_progress: statsData?.in_progress ?? 0,
        completed: statsData?.completed ?? 0,
        overdue: statsData?.overdue ?? 0,
        high_priority: statsData?.high_priority ?? 0
      });
      
      //setRecentTodos(todosData?.todos || []);
      setRecentTodos(todosData || []);
      setStudents(studentsData || []);
      setStudentCount(studentsData?.length || 0);
      setRecentAudit(auditData?.items || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Data for pie chart (todo status distribution)
  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'In Progress', value: stats.in_progress, color: '#3b82f6' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Mock weekly activity data (replace with real endpoint when available)
  const trendData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 3, pending: 5 },
    { day: 'Wed', completed: 7, pending: 3 },
    { day: 'Thu', completed: 2, pending: 6 },
    { day: 'Fri', completed: 5, pending: 4 },
    { day: 'Sat', completed: 1, pending: 2 },
    { day: 'Sun', completed: 0, pending: 1 }
  ];

  const StatCard = ({ title, value, icon: Icon, bgColor }: any) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <div className="text-center py-10">Please login to view dashboard</div>;
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
        <p className="opacity-90">Here's what's happening with your todos today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Todos" value={stats.total} icon={ClipboardDocumentListIcon} bgColor="bg-blue-500" />
        <StatCard title="Students" value={studentCount} icon={UserGroupIcon} bgColor="bg-green-500" />
        <StatCard title="Pending" value={stats.pending} icon={ClockIcon} bgColor="bg-yellow-500" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircleIcon} bgColor="bg-green-600" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/students" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Students</h3>
            <p className="text-sm text-gray-500">Add, edit, or remove students</p>
          </div>
        </Link>
        <Link href="/todos" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ClipboardDocumentListIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Todos</h3>
            <p className="text-sm text-gray-500">Create and track todos</p>
          </div>
        </Link>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie chart – todo status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Todo Status Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">No data available</p>
          )}
        </div>

        {/* Bar chart – weekly activity (mock) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity (Sample)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            * Replace with real backend data when trends endpoint is available.
          </p>
        </div>
      </div>

      {/* Recent activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent todos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Todos</h2>
            <Link href="/todos" className="text-sm text-blue-500 hover:underline">View all</Link>
          </div>
          {recentTodos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent todos</p>
          ) : (
            <div className="space-y-3">
              {recentTodos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{todo.title}</p>
                    <p className="text-xs text-gray-500">
                      {students.find(s => s.id === todo.student_id)?.student_name || 'Unknown'} • {new Date(todo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                    todo.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{todo.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent audit logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ShieldExclamationIcon className="h-5 w-5 text-gray-500" /> Recent Activity</h2>
            <Link href="/audit" className="text-sm text-blue-500 hover:underline">View all</Link>
          </div>
          {recentAudit.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentAudit.map(log => (
                <div key={log.id} className="text-sm border-b pb-2">
                  <p><span className={`font-medium ${
                    log.action === 'INSERT' ? 'text-green-600' :
                    log.action === 'UPDATE' ? 'text-blue-600' :
                    log.action === 'DELETE' ? 'text-red-600' : ''
                  }`}>{log.action}</span> on {log.table_name} (ID: {log.record_id})</p>
                  <p className="text-xs text-gray-500">by {log.changed_by_username || 'System'} • {new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}