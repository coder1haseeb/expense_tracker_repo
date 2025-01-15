"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [viewMode, setViewMode] = useState("list"); // 'list', 'line', 'bar', or 'pie'
  const router = useRouter();

  const categories = [
    "All",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Home",
    "Healthcare",
    "Shopping",
  ];
  const getUserId = () => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("user=")
    );
    if (userCookie) {
      const userData = JSON.parse(userCookie.split("=")[1]);
      return userData.id;
    }
    return null;
  };

  const fetchExpenses = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not found");
      }
      const response = await fetch(`/api/expenses?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not found");
      }
      const res = await fetch(`/api/expenses/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }

      // Refresh expenses list
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (expense) =>
          expense.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply time filter
    const today = new Date();
    if (timeFilter === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= weekAgo
      );
    } else if (timeFilter === "month") {
      const monthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= monthAgo
      );
    } else if (timeFilter === "year") {
      const yearAgo = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= yearAgo
      );
    } else if (timeFilter === "custom" && dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.date) >= new Date(dateRange.start) &&
          new Date(expense.date) <= new Date(dateRange.end)
      );
    }

    return filtered;
  };

  const calculateSumsByCurrency = (expenses) => {
    const sums = {};

    expenses.forEach((expense) => {
      const { currency, amount } = expense;
      if (!sums[currency]) {
        sums[currency] = 0;
      }
      sums[currency] += parseFloat(amount); // Add the amount to the currency total
    });

    return sums;
  };

  const prepareLineChartData = (expenses) => {
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return {
      labels: sortedExpenses.map((expense) =>
        new Date(expense.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Expenses Over Time",
          data: sortedExpenses.map((expense) => expense.amount),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareBarChartData = (expenses) => {
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return {
      labels: sortedExpenses.map((expense) =>
        new Date(expense.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Expenses By Day",
          data: sortedExpenses.map((expense) => expense.amount),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
    };
  };

  const preparePieChartData = (expenses) => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const colors = [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
    ];

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: colors.slice(0, Object.keys(categoryTotals).length),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expense Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses by Category",
      },
    },
  };

  const filteredExpenses = filterExpenses();
  const totalsByCurrency = calculateSumsByCurrency(filteredExpenses);
  const lineChartData = prepareLineChartData(filteredExpenses);
  const barChartData = prepareBarChartData(filteredExpenses);
  const pieChartData = preparePieChartData(filteredExpenses);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg m-4">{error}</div>
    );
  }

  return (
    <div className="bg-gray-50 p-8" style={{ minHeight: `calc(100vh - 4rem)` }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Expenses Dashboard
          </h1>
          <div className="flex gap-4">
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${
                  viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("line")}
                className={`px-4 py-2 ${
                  viewMode === "line" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setViewMode("bar")}
                className={`px-4 py-2 ${
                  viewMode === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setViewMode("pie")}
                className={`px-4 py-2 ${
                  viewMode === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Pie Chart
              </button>
            </div>
            <button
              onClick={() => router.push("/expenses/new")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Expense
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {timeFilter === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
              </>
            )}
          </div>

          {filteredExpenses.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-blue-800 font-semibold">
                Total Expenses:
              </p>
              {Object.entries(totalsByCurrency).map(([currency, total]) => (
                <p key={currency} className="text-blue-800">
                  {total.toFixed(2)} {currency}
                </p>
              ))}
            </div>
          )}
        </div>

        {viewMode === "line" ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        ) : viewMode === "bar" ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        ) : viewMode === "pie" ? (
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center">
            <div style={{ width: "600px", height: "600px" }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {expense.title}
                      </h3>
                      <p className="text-gray-500">{expense.category}</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {expense.currency}
                      {expense.amount}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>{expense.description}</p>
                    <p className="mt-2">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        router.push(
                          `/expenses/${expense.id}?userId=${getUserId()}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/expenses/${expense.id}/edit?userId=${getUserId()}`
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
