import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { ItemName: '', Description: '', QuantityIn: '', SupplierName: '', StockInDate: '' };

export default function StockIn() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async (q = '') => {
    try {
      const params = q ? { search: q } : {};
      const res = await api.get('/stockin', { params });
      setRecords(res.data);
    } catch { toast.error('Failed to load records'); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ItemName || !form.QuantityIn || !form.StockInDate) {
      return toast.error('ItemName, QuantityIn, and Date are required');
    }
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/stockin/${editing}`, form);
        toast.success('Record updated');
      } else {
        await api.post('/stockin', form);
        toast.success('Record created');
      }
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Operation failed';
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const handleEdit = (rec) => {
    setForm({
      ItemName: rec.ItemName,
      Description: rec.Description || '',
      QuantityIn: rec.QuantityIn,
      SupplierName: rec.SupplierName || '',
      StockInDate: rec.StockInDate?.split('T')[0] || rec.StockInDate
    });
    setEditing(rec.StockInID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/stockin/${id}`);
      toast.success('Record deleted');
      fetchRecords();
    } catch { toast.error('Delete failed'); }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock In Records</h1>
          <p className="text-gray-500 text-sm">Manage incoming stock</p>
        </div>
        <button onClick={() => { cancelForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer">
          {showForm ? 'Cancel' : '+ New Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Record' : 'New Stock In Record'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input type="text" value={form.ItemName} onChange={e => setForm({...form, ItemName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" placeholder="e.g. Cement" list="items-list" />
              <datalist id="items-list">
                {['Steel bars','Wheelbarrows','Ceramic tiles','Cement','Painting brush','Color Paint','Masonry nails','Iron sheets'].map(i => <option key={i} value={i} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" min="1" value={form.QuantityIn} onChange={e => setForm({...form, QuantityIn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={form.StockInDate} onChange={e => setForm({...form, StockInDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <input type="text" value={form.SupplierName} onChange={e => setForm({...form, SupplierName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" placeholder="Supplier name" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.Description} onChange={e => setForm({...form, Description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" placeholder="Optional description" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition text-sm font-medium cursor-pointer">
              {submitting ? 'Saving...' : editing ? 'Update Record' : 'Save Record'}
            </button>
            <button type="button" onClick={cancelForm} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by item, supplier..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
            <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium cursor-pointer">Search</button>
            {search && <button type="button" onClick={() => { setSearch(''); fetchRecords(); }} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition text-sm cursor-pointer">Clear</button>}
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Item Name</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Quantity</th>
                <th className="text-left px-4 py-3">Supplier</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Recorded By</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(r => (
                <tr key={r.StockInID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">#{r.StockInID}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.ItemName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.Description || '-'}</td>
                  <td className="px-4 py-3">{r.QuantityIn}</td>
                  <td className="px-4 py-3">{r.SupplierName || '-'}</td>
                  <td className="px-4 py-3">{r.StockInDate?.split('T')[0]}</td>
                  <td className="px-4 py-3">{r.UserName}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => handleEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(r.StockInID)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
