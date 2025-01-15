"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function ExpenseDetails() {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id;

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not found");
      }

      const res = await fetch(`/api/expenses/${expenseId}?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch expense");
      }

      setExpense(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not found");
      }

      const res = await fetch(`/api/expenses/${params.id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }

      router.push("/expenses");
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!expense) {
    return <div className="text-center p-4">Expense not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="space-x-4">
            <button
              onClick={() => router.push(`/expenses/${params.id}/edit`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {expense.title}
            </h1>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Amount</h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {expense.currency}{expense.amount}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Category</h2>
                <p className="text-lg text-gray-900">{expense.category}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Date</h2>
              <p className="text-lg text-gray-900">
                {new Date(expense.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {expense.description && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Notes
                </h2>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {expense.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
