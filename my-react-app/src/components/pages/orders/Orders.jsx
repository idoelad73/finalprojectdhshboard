import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import TableWrapper from '../../pages/dashboard/Tablewrapper';
import { Trash2, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import UpdateOrderModal from '../orders/UpdateOrder'


export default function Orders({ orders, loading, error }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userOrders, setUserOrders] = useState(orders);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);
  const [errorUserOrders, setErrorUserOrders] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);


  // ===============================
  // Fetch users
  // ===============================
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/all`)
      .then(res =>
        setUsers(Array.isArray(res.data) ? res.data : res.data.users || [])
      )
      .catch(() => console.error('Failed to fetch users'))
      .finally(() => setLoadingUsers(false));
  }, []);

  // ===============================
  // Fetch orders by user
  // ===============================
  useEffect(() => {
    if (!selectedUserId) {
      setUserOrders(orders);
      return;
    }

    setLoadingUserOrders(true);
    setErrorUserOrders('');

    axios
      .get(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/user-orders/${selectedUserId}`
      )
      .then(res => setUserOrders(res.data.orders || []))
      .catch(() => setErrorUserOrders('Failed to fetch user orders'))
      .finally(() => setLoadingUserOrders(false));
  }, [selectedUserId, orders]);

  // ===============================
  // Free search by order number
  // ===============================
  const filteredOrders = useMemo(() => {
    const search = orderSearch.trim().toLowerCase();
    if (!search) return userOrders;

    return userOrders.filter(order =>
      order.orderNumber?.toLowerCase().includes(search)
    );
  }, [orderSearch, userOrders]);

  // ===============================
  // Delete Order
  // ===============================
  const handleDeleteOrder = (orderId, orderNumber) => {
    Swal.fire({
      title: 'Delete Order?',
      html: `Are you sure you want to delete <b>${orderNumber}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete'
    }).then(async result => {
      if (!result.isConfirmed) return;

      try {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/deleteorder/${orderId}`
        );

        setUserOrders(prev =>
          prev.filter(order => order._id !== orderId)
        );

        Swal.fire('Deleted!', 'Order has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete order.', 'error');
      }
    });
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setIsUpdateOpen(true);
  };
  
  

  return (
    <div className="space-y-6">

      {/* -------------------- Filters -------------------- */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-slate-700">User Email:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 bg-white"
          >
            <option value="">All Users</option>
            {loadingUsers ? (
              <option>Loading...</option>
            ) : (
              users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.user_email}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold text-slate-700">Order #:</label>
          <input
            type="text"
            placeholder="Search order number"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 w-64"
          />
        </div>
      </div>

      {/* -------------------- Orders -------------------- */}
      <TableWrapper loading={loadingUserOrders || loading} error={errorUserOrders || error}>
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg border overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-sm opacity-80">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white/20`}>
                      {order.status}
                    </span>

                    <button
                      onClick={() => handleUpdateOrder(order)}
                      className="hover:text-yellow-300 transition"
                      title="Update Order"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteOrder(order._id, order.orderNumber)
                      }
                      className="hover:text-red-300 transition"
                      title="Delete Order"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
               
                <UpdateOrderModal
  isOpen={isUpdateOpen}
  order={selectedOrder}
  onClose={() => {
    setIsUpdateOpen(false);
    setSelectedOrder(null);
  }}
  onUpdated={(updatedOrder) => {
    setUserOrders(prev =>
      prev.map(o =>
        o._id === updatedOrder._id ? updatedOrder : o
      )
    );
  }}
/>


                {/* Products */}
                <div className="overflow-x-auto p-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-center">Category</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map(item => (
                        <tr key={item._id} className="border-t">
                          <td className="px-3 py-2">
                            {item.product_id?.title || 'Unknown'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.product_id?.category || 'N/A'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-right">
                            ${item.product_rtp.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-indigo-600">
                            ${(item.product_rtp * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 border-t">
                  <div>
                    <p className="font-semibold">Shipping</p>
                    <p>{order.user_adress}</p>
                    <p className="text-sm text-gray-600">{order.user_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Paid</p>
                    <p className="text-xl font-bold text-indigo-600">
                      ${order.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            No orders found.
          </div>
        )}
      </TableWrapper>
    </div>
  );
}
