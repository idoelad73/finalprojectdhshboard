import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function OrdersByCategoryBar() {
  const [ordersByCategory, setOrdersByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryColors = [
    '#6366f1',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#3b82f6',
    '#f472b6',
    '#facc15'
  ];

  useEffect(() => {
    const fetchOrdersByCategory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/category-orders`
        );

        const chartData = res.data.data.map(item => ({
          category: item._id,
          orders: item.totalOrders
        }));

        setOrdersByCategory(chartData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch orders by category');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByCategory();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading orders chart...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Orders by Category
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ordersByCategory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="category" tick={{ fill: '#4b5563', fontWeight: 600 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#4b5563', fontWeight: 600 }} />
          <Tooltip />
          <Legend />

          <Bar dataKey="orders" radius={[8, 8, 0, 0]} barSize={40}>
            {ordersByCategory.map((_, index) => (
              <Cell
                key={index}
                fill={categoryColors[index % categoryColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
