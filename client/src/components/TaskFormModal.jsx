import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const today = new Date().toISOString().split('T')[0];

const TaskFormModal = ({ open, task, loading, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: today,
      status: 'Pending'
    }
  });

  useEffect(() => {
    reset({
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : today,
      status: task?.status || 'Pending'
    });
  }, [reset, task, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl rounded-md bg-white p-6 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">{task ? 'Edit Task' : 'Create Task'}</h2>
            <p className="mt-1 text-sm text-slate-500">Keep the next action clear and trackable.</p>
          </div>
          <button className="focus-ring rounded-md p-2 text-slate-500" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span className="mt-1 block text-sm text-coral">{errors.title.message}</span>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              rows="5"
              className="focus-ring mt-2 w-full resize-none rounded-md border border-line px-3 py-2"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <span className="mt-1 block text-sm text-coral">{errors.description.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Due Date</span>
            <input
              type="date"
              min={today}
              className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
              {...register('dueDate', {
                required: 'Due date is required',
                validate: (value) => value >= today || 'Due date cannot be in the past'
              })}
            />
            {errors.dueDate && (
              <span className="mt-1 block text-sm text-coral">{errors.dueDate.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
              {...register('status')}
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskFormModal;
