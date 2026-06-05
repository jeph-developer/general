import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ stockInCount: 0, stockOutCount: 0, itemsCount: 0, totalReceived: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/stockin'),
      api.get('/stockout'),
      api.get('/reports/stock-status')
    ]).then(([si, so, rep]) => {
      const totalReceived = rep.data.reduce((sum, r) => sum + r.TotalQuantityReceived, 0);
      setStats({
        stockInCount: si.data.length,
        stockOutCount: so.data.length,
        itemsCount: rep.data.length,
        totalReceived
      });
    }).catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Stock In Records',
      value: stats.stockInCount,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
      color: 'bg-emerald-500'
    },
    {
      label: 'Stock Out Records',
      value: stats.stockOutCount,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>,
      color: 'bg-orange-500'
    },
    {
      label: 'Unique Items',
      value: stats.itemsCount,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Items Received',
      value: stats.totalReceived,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user?.userName}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>{card.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/stockin" className="block p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition text-center">
            <p className="font-medium text-blue-700">Record Stock In</p>
            <p className="text-sm text-blue-500 mt-1">Add items received</p>
          </a>
          <a href="/stockout" className="block p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition text-center">
            <p className="font-medium text-orange-700">Record Stock Out</p>
            <p className="text-sm text-orange-500 mt-1">Issue items from stock</p>
          </a>
          <a href="/reports" className="block p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition text-center">
            <p className="font-medium text-green-700">View Reports</p>
            <p className="text-sm text-green-500 mt-1">Check stock status</p>
          </a>
        </div>
      </div>
    </div>
  );
}
