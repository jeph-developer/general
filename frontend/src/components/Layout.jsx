import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
      isActive ? 'bg-white/20 text-white font-medium' : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-slate-800 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">SMS</h1>
          <p className="text-xs text-white/60 mt-0.5">Store Management System</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/dashboard" className={linkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </NavLink>
          <NavLink to="/stockin" className={linkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Stock In
          </NavLink>
          <NavLink to="/stockout" className={linkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            Stock Out
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Stock Report
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">{user?.userName?.[0]?.toUpperCase()}</div>
            <div className="text-sm truncate">
              <p className="font-medium truncate">{user?.userName}</p>
              <p className="text-xs text-white/50">Logged in</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-sm text-white/70 hover:text-white flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
