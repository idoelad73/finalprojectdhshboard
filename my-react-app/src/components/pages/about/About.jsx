export default function AboutPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-10 border border-slate-200">
              <div className="text-center mb-7 sm:mb-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">About Dashboard</h2>
                <p className="text-base sm:text-xl text-slate-600">Your Central Command Center</p>
              </div>
  
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-3">What is Dashboard?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Dashboard is your comprehensive data visualization and management platform designed to provide 
                    real-time insights into your business metrics. With an intuitive interface and powerful analytics, 
                    you can make informed decisions faster than ever before.
                  </p>
                </div>
  
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">Real-Time Analytics</h4>
                    <p className="text-slate-600 text-sm">Monitor your key metrics with live data updates and interactive charts.</p>
                  </div>
  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">Secure & Private</h4>
                    <p className="text-slate-600 text-sm">Enterprise-grade security ensures your data remains protected at all times.</p>
                  </div>
  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">Lightning Fast</h4>
                    <p className="text-slate-600 text-sm">Optimized performance delivers insights instantly, no waiting required.</p>
                  </div>
                </div>
  
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Customizable widgets and layouts to match your workflow
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Collaborative tools for team-wide visibility and insights
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Export and share reports with just a few clicks
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }