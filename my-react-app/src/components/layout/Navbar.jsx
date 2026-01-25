import { Link } from 'react-router-dom';

export default function DashboardNavbar({ activeTab }) {
  return (
    <nav className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            <Link
              to="/login"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Login
            </Link>

            <Link
              to="/about"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
