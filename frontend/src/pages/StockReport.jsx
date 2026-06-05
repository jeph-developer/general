import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function StockReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/stock-status')
      .then(res => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalReceived = report.reduce((s, r) => s + r.TotalQuantityReceived, 0);
  const totalIssued = report.reduce((s, r) => s + r.TotalQuantityIssued, 0);
  const totalRemaining = report.reduce((s, r) => s + r.RemainingStock, 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daily Stock Status Report</h1>
        <p className="text-gray-500 text-sm">Comprehensive stock overview - {new Date().toLocaleDateString()}</p>
      </div>

      {report.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-lg">No stock data available</p>
          <p className="text-gray-400 text-sm mt-1">Add some Stock In records first</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-sm text-emerald-600 font-medium">Total Received</p>
              <p className="text-2xl font-bold text-emerald-800">{totalReceived}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-orange-600 font-medium">Total Issued</p>
              <p className="text-2xl font-bold text-orange-800">{totalIssued}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Remaining in Stock</p>
              <p className="text-2xl font-bold text-blue-800">{totalRemaining}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">Item Name</th>
                    <th className="text-right px-5 py-3">Total Quantity Received</th>
                    <th className="text-right px-5 py-3">Total Quantity Issued</th>
                    <th className="text-right px-5 py-3">Remaining Quantity</th>
                    <th className="text-center px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.map((r, i) => (
                    <tr key={r.ItemName} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{r.ItemName}</td>
                      <td className="px-5 py-3 text-right font-medium text-emerald-700">{r.TotalQuantityReceived}</td>
                      <td className="px-5 py-3 text-right font-medium text-orange-700">{r.TotalQuantityIssued}</td>
                      <td className={`px-5 py-3 text-right font-bold ${r.RemainingStock > 0 ? 'text-blue-700' : r.RemainingStock === 0 ? 'text-gray-500' : 'text-red-600'}`}>
                        {r.RemainingStock}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {r.RemainingStock > 20 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                        ) : r.RemainingStock > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td colSpan={2} className="px-5 py-3 text-gray-700">Totals</td>
                    <td className="px-5 py-3 text-right text-emerald-700">{totalReceived}</td>
                    <td className="px-5 py-3 text-right text-orange-700">{totalIssued}</td>
                    <td className="px-5 py-3 text-right text-blue-700">{totalRemaining}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
