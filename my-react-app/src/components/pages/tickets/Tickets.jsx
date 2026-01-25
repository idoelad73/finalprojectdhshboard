import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TableWrapper from '../../pages/dashboard/Tablewrapper';
import { Mail, AlertCircle } from 'lucide-react';

export default function Tickets() {
  const [search, setSearch] = useState('');

  // ===============================
  // Fetch all tickets
  // ===============================
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/support/getall-ticket`
      );
      return res.data.tickets || [];
    }
  });

  // ===============================
  // Search filter (free text)
  // ===============================
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return data || [];

    const value = search.toLowerCase();

    return (data || []).filter(ticket =>
      ticket.ticketNumber?.toLowerCase().includes(value)
    );
  }, [search, data]);

  return (
    <div className="space-y-6">

      {/* -------------------- Search -------------------- */}
      <div className="flex items-center gap-4">
        <label className="font-semibold text-slate-700">Ticket #:</label>
        <input
          type="text"
          placeholder="Search ticket number (e.g. T00003)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 w-64
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* -------------------- Tickets -------------------- */}
      <TableWrapper loading={isLoading} error={isError && error?.message}>
        {filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map(ticket => (
              <div
                key={ticket._id}
                className="bg-white rounded-2xl shadow-lg border overflow-hidden"
              >

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold">
                      Ticket #{ticket.ticketNumber}
                    </span>
                    <span className="text-sm opacity-80">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Priority */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${ticket.priority === 'high'
                        ? 'bg-red-500'
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-green-500'
                      }`}
                    >
                      {ticket.priority}
                    </span>

                    {/* Status */}
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">

                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail size={18} />
                    <span className="font-medium">{ticket.user_email}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-indigo-600 mb-1">
                      {ticket.subject}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {ticket.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span>
                      <strong>Category:</strong> {ticket.category}
                    </span>
                    <span>
                      <strong>Name:</strong> {ticket.name}
                    </span>
                  </div>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t p-4 flex items-center gap-2 text-sm text-slate-500">
                  <AlertCircle size={16} />
                  Ticket created at {new Date(ticket.createdAt).toLocaleString()}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            No tickets found.
          </div>
        )}
      </TableWrapper>
    </div>
  );
}
