import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ListTodo,
  Plus,
  RotateCcw,
  Search,
  Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';
import TaskFormModal from '../components/TaskFormModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus
} from '../services/taskService.js';
import { formatDate } from '../utils/formatDate.js';

const Dashboard = () => {
  const { notify } = useToast();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: 'All', sort: 'newest', limit: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(filters.search);

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: filters.limit,
      sort: filters.sort,
      search: debouncedSearch || undefined,
      status: filters.status === 'All' ? undefined : filters.status
    }),
    [debouncedSearch, filters.limit, filters.sort, filters.status, pagination.page]
  );

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [params]);

  const updateFilter = (key, value) => {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      await createTask(values);
      notify('Task created');
      setModalOpen(false);
      await loadTasks();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteTask(deleteTarget._id);
      notify('Task deleted');
      setDeleteTarget(null);
      await loadTasks();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      await toggleTaskStatus(task._id);
      notify(`Task marked ${task.status === 'Completed' ? 'Pending' : 'Completed'}`);
      await loadTasks();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Tasks" value={stats.total} icon={ClipboardList} />
        <StatCard label="Pending Tasks" value={stats.pending} icon={ListTodo} tone="amber" />
        <StatCard label="Completed Tasks" value={stats.completed} icon={CheckCircle2} tone="mint" />
      </section>

      <section className="rounded-md border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">Search, filter, sort, and manage your task list.</p>
          </div>
          <button
            onClick={openCreate}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        <div className="grid gap-3 border-b border-line p-4 md:grid-cols-[1fr_170px_170px_130px]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              className="focus-ring w-full rounded-md border border-line py-2 pl-10 pr-3"
              placeholder="Search title or description"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>
          <select
            className="focus-ring rounded-md border border-line px-3 py-2"
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select
            className="focus-ring rounded-md border border-line px-3 py-2"
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select
            className="focus-ring rounded-md border border-line px-3 py-2"
            value={filters.limit}
            onChange={(event) => updateFilter('limit', Number(event.target.value))}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Loading tasks" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No tasks found" message="Create a task or adjust your filters to see results." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="max-w-xs px-4 py-4 align-top text-sm font-semibold text-ink">{task.title}</td>
                      <td className="max-w-md px-4 py-4 align-top text-sm text-slate-600">{task.description}</td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className={`focus-ring rounded-md px-3 py-1 text-xs font-semibold ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 text-mint'
                              : 'bg-amber-50 text-amber'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-slate-600">
                        {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            className={`focus-ring inline-flex min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
                              task.status === 'Completed'
                                ? 'border-amber-200 text-amber hover:bg-amber-50'
                                : 'border-emerald-200 text-mint hover:bg-emerald-50'
                            }`}
                            onClick={() => handleToggle(task)}
                            aria-label={
                              task.status === 'Completed' ? 'Mark task as pending' : 'Complete task'
                            }
                          >
                            {task.status === 'Completed' ? <RotateCcw size={17} /> : <CheckCircle2 size={17} />}
                            {task.status === 'Completed' ? 'Pending' : 'Complete'}
                          </button>
                          <button
                            className="focus-ring rounded-md border border-line p-2 text-coral hover:bg-red-50"
                            onClick={() => setDeleteTarget(task)}
                            aria-label="Delete task"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} tasks)
              </p>
              <div className="flex gap-2">
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <TaskFormModal
        open={modalOpen}
        task={null}
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task?"
        message={`This will permanently remove "${deleteTarget?.title || 'this task'}" from your workspace.`}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
