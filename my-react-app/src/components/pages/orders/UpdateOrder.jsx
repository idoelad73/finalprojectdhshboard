import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/* ======================================================
   UPDATE ORDER MODAL COMPONENT
   Handles editing status, notes, shipping address, phone
====================================================== */
export default function UpdateOrderModal({ isOpen, order, onClose, onUpdated }) {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [userAdress, setUserAdress] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Populate form when order changes
  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setNotes(order.notes || '');
      setUserAdress(order.user_adress || '');
      setUserPhone(order.user_phone || '');
    }
  }, [order]);

  // TanStack Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/updateorder/${id}`,
        data
      );
      return res.data.updatedOrder || res.data;
    },

    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });

      onUpdated(updatedOrder);
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate({
      id: order._id,
      data: {
        status,
        notes,
        user_adress: userAdress,
        user_phone: userPhone
      }
    });
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-1">Update Order</h2>
        <p className="text-sm text-gray-500 mb-6 font-mono">#{order.orderNumber}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-1">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes (optional)"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Shipping Address</label>
            <input
              type="text"
              value={userAdress}
              onChange={(e) => setUserAdress(e.target.value)}
              placeholder="User address"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="User phone"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 rounded-lg text-white font-semibold
                ${isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {isPending ? 'Updating...' : 'Update Order'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
