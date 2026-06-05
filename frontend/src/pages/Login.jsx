import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ UserName: '', Password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.UserName || !form.Password) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(form.UserName, form.Password);
        toast.success('Account created! You are now logged in.');
      } else {
        await login(form.UserName, form.Password);
        toast.success('Login successful');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || (isRegister ? 'Registration failed' : 'Login failed');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setForm({ UserName: '', Password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Store Management System</h2>
          <p className="text-gray-500 text-sm mt-1">DAB Enterprise LTD</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={form.UserName}
              onChange={e => setForm({ ...form, UserName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.Password}
              onChange={e => setForm({ ...form, Password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer"
          >
            {submitting
              ? (isRegister ? 'Creating account...' : 'Signing in...')
              : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">DAB Enterprise LTD &copy; 2026</p>
      </div>
    </div>
  );
}
