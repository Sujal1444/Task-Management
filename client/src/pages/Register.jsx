import { CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await registerUser(values);
      notify('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-10 lg:grid-cols-[1fr_560px] lg:px-0 lg:py-0">
      <section className="hidden items-center justify-center bg-ink px-12 text-white lg:flex">
        <div className="max-w-lg">
          <CheckSquare size={52} className="text-mint" />
          <h1 className="mt-8 text-5xl font-semibold leading-tight">Task Manager</h1>
          <p className="mt-5 text-lg text-slate-300">
            Create your workspace and start organizing tasks with clear ownership and status.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-md bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-ink">Create account</h2>
          <p className="mt-2 text-sm text-slate-500">All fields are required.</p>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Full Name</span>
              <input
                className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
                {...register('name', { required: 'Full name is required', minLength: 2 })}
              />
              {errors.name && <span className="mt-1 block text-sm text-coral">{errors.name.message}</span>}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span className="mt-1 block text-sm text-coral">{errors.email.message}</span>}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
              />
              {errors.password && (
                <span className="mt-1 block text-sm text-coral">{errors.password.message}</span>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
              <input
                className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-sm text-coral">{errors.confirmPassword.message}</span>
              )}
            </label>
          </div>

          <button
            className="focus-ring mt-6 flex w-full justify-center rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <Spinner label="Creating account" /> : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link className="font-semibold text-brand" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Register;

