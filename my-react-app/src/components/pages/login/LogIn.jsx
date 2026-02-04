import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


export default function LoginPage() {
  const [user_email, setEmail] = useState('');
  const [user_password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    },

    onSuccess: (data) => {
        // Store email for dashboard
        localStorage.setItem("token", data.token);
        localStorage.setItem('admin_email', data.user.user_email);
        console.log('admin_email', data.user.user_email);
      
        // Check role
        if (data.user.user_role === 'admin') {
          navigate('/dashboard');
        } else {
          // SweetAlert2 popup
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You are not authorized to access the dashboard',
            confirmButtonColor: '#6366f1', // Tailwind Indigo color
          });
        }
      },
      
      
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ user_email, user_password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={user_password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300"
              required
            />
          </div>

          {loginMutation.isError && (
            <p className="text-red-500 text-sm">
              {loginMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600
                       text-white py-3 rounded-xl font-semibold"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
