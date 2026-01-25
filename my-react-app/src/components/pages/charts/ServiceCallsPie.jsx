import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ServiceCallsPie() {
  const [ticketsByCategory, setTicketsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#6366f1',
    '#f472b6',
    '#facc15'
  ];

  useEffect(() => {
    const fetchTicketsByCategory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/support/category-ticket`
        );

        const formattedData = res.data.data.map((item, index) => ({
          name: item._id,
          value: item.totalTickets,
          color: colors[index % colors.length]
        }));

        setTicketsByCategory(formattedData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch support tickets by category');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsByCategory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center text-gray-500">
        Loading support tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Service Calls by Category
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={ticketsByCategory}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {ticketsByCategory.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
