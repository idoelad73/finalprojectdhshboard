import { useState, useEffect } from 'react';
import axios from 'axios';

// Pages / Components
import Products from '../products/Products';
import Orders from '../orders/Orders';
import Users from '../users/Users';
import Tickets from '../tickets/Tickets';
import Summary from '../summary/Summary';
import Charts from '../charts/Charts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [adminEmail, setAdminEmail] = useState('');

  // ===============================
  // Data States
  // ===============================
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);

  // ===============================
  // Loading States
  // ===============================
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ===============================
  // Error States
  // ===============================
  const [errorProducts, setErrorProducts] = useState('');
  const [errorOrders, setErrorOrders] = useState('');
  const [errorUsers, setErrorUsers] = useState('');
  const [errorTickets, setErrorTickets] = useState('');

  // ===============================
  // Admin Email
  // ===============================
  useEffect(() => {
    const email = localStorage.getItem('admin_email');
    if (email) setAdminEmail(email);
  }, []);

  // ===============================
  // Fetch Products
  // ===============================
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/all`)
      .then(res =>
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || [])
      )
      .catch(() => setErrorProducts('Failed to fetch products'))
      .finally(() => setLoadingProducts(false));
  }, []);

  // ===============================
  // Fetch Orders
  // ===============================
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders`)
      .then(res =>
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || [])
      )
      .catch(() => setErrorOrders('Failed to fetch orders'))
      .finally(() => setLoadingOrders(false));
  }, []);

  // ===============================
  // Fetch Users
  // ===============================
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/all`)
      .then(res =>
        setUsers(Array.isArray(res.data) ? res.data : res.data.users || [])
      )
      .catch(() => setErrorUsers('Failed to fetch users'))
      .finally(() => setLoadingUsers(false));
  }, []);

  // ===============================
  // Fetch Tickets
  // ===============================
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/support/getall-ticket`)
      .then(res =>
        setTickets(Array.isArray(res.data) ? res.data : res.data.tickets || [])
      )
      .catch(() => setErrorTickets('Failed to fetch support tickets'))
      .finally(() => setLoadingTickets(false));
  }, []);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-6xl font-black text-white mb-3 drop-shadow-lg">
            Dashboard
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Admin */}
        {adminEmail && (
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-semibold shadow-lg">
            Login admin = <span className="font-black">{adminEmail}</span>
          </div>
        )}

        <Summary />
        <Charts />

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-10 flex">

          {/* LEFT TABS */}
          <div className="w-60 bg-slate-50 border-r border-slate-200 p-4 space-y-2">

            {[
              { key: 'products', label: 'Products', color: 'bg-indigo-500' },
              { key: 'orders', label: 'Orders', color: 'bg-purple-500' },
              { key: 'tickets', label: 'Tickets', color: 'bg-pink-500' },
              { key: 'users', label: 'Users', color: 'bg-emerald-500' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all
                  ${
                    activeTab === tab.key
                      ? `${tab.color} text-white shadow-lg`
                      : 'text-slate-600 hover:bg-white hover:shadow'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-6">

            {activeTab === 'products' && (
              <Products
                products={products}
                loading={loadingProducts}
                error={errorProducts}
              />
            )}

            {activeTab === 'orders' && (
              <Orders
                orders={orders}
                loading={loadingOrders}
                error={errorOrders}
              />
            )}

            {activeTab === 'tickets' && (
              <Tickets
                tickets={tickets}
                loading={loadingTickets}
                error={errorTickets}
              />
            )}

            {activeTab === 'users' && (
              <Users
                users={users}
                loading={loadingUsers}
                error={errorUsers}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
