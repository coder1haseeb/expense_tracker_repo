import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24 gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl lg:leading-[60px] font-bold text-gray-900 mb-6">
              Track Your Expenses
              <span className="text-blue-600"> Effortlessly</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Take control of your finances with our intuitive expense tracking app. Monitor your spending, set budgets, and achieve your financial goals with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/signUp"
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-lg"
              >
                Get Started Free
              </a>
              <a
                href="/login"
                className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg"
              >
                Login
              </a>
            </div>
            
            {/* Feature List */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Tracking</h3>
                  <p className="text-gray-600">Record expenses with just a few taps</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visual Reports</h3>
                  <p className="text-gray-600">Understand your spending patterns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Section */}
          <div className="flex-1 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-blue-600 text-2xl font-bold mb-2">$2,450</div>
              <div className="text-gray-600">Average Monthly Savings</div>
              <div className="mt-4 text-sm text-green-600">↑ 12% from last month</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-blue-600 text-2xl font-bold mb-2">85%</div>
              <div className="text-gray-600">Budget Utilization</div>
              <div className="mt-4 text-sm text-blue-600">On track with goals</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-blue-600 text-2xl font-bold mb-2">15+</div>
              <div className="text-gray-600">Expense Categories</div>
              <div className="mt-4 text-sm text-gray-600">Customizable tracking</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="text-blue-600 text-2xl font-bold mb-2">24/7</div>
              <div className="text-gray-600">Real-time Updates</div>
              <div className="mt-4 text-sm text-gray-600">Instant notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


