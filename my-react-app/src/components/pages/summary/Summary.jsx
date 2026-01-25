import { useEffect, useState } from 'react';
import axios from 'axios';

/* -------------------- Custom Hook for Animated Count -------------------- */
function useAnimatedCount(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        setCount(Math.floor(progress * target));
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

/* -------------------- Summary Component -------------------- */
export default function Summary() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/all`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/all`)
        ]);

        setProductsCount(Array.isArray(productsRes.data) ? productsRes.data.length : productsRes.data.products?.length || 0);
        setOrdersCount(Array.isArray(ordersRes.data) ? ordersRes.data.length : ordersRes.data.orders?.length || 0);
        setUsersCount(Array.isArray(usersRes.data) ? usersRes.data.length : usersRes.data.users?.length || 0);
      } catch (err) {
        setError('Failed to fetch summary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const animatedProducts = useAnimatedCount(productsCount);
  const animatedOrders = useAnimatedCount(ordersCount);
  const animatedUsers = useAnimatedCount(usersCount);

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center py-10 text-red-600 font-semibold">{error}</div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Products" value={animatedProducts} gradient="from-cyan-400 to-blue-500" icon={productsIcon} />
      <StatCard title="Total Orders" value={animatedOrders} gradient="from-emerald-400 to-teal-500" icon={ordersIcon} />
      <StatCard title="Total Users" value={animatedUsers} gradient="from-pink-400 to-rose-500" icon={usersIcon} />
    </div>
  );
}

/* -------------------- Reusable Stat Card -------------------- */
function StatCard({ title, value, gradient, icon }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white/80 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-black text-white mt-2">{value}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
}

/* -------------------- Icons -------------------- */
const productsIcon = (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ordersIcon = (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const usersIcon = (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
