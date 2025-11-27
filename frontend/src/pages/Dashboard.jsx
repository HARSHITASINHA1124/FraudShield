import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // 🔥 Fetch Blockchain on Load
  useEffect(() => {
    fetch("http://localhost:5000/api/blockchain")
      .then(res => res.json())
      .then(blocks => {
        // Filter out the genesis block
        const txns = blocks
          .filter(b => b.index !== 0)
          .map(b => ({
            id: b.index,
            amount: b.transaction.amount,
            riskScore: b.transaction.riskScore,
            status: b.transaction.status,
            date: new Date(b.timestamp).toLocaleDateString(),
          }));

        setTransactions(txns);

        // Prepare chart data
        const chartFormatted = txns.map(t => ({
          date: t.date,
          amount: t.amount,
        }));

        setChartData(chartFormatted);
      })
      .catch(err => console.error("Error loading blockchain:", err));
  }, []);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <h2 className="text-2xl font-bold">FraudShield</h2>

        <div className="flex gap-6">
          <a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a>
          <a href="/predict" className="hover:text-blue-400 transition">Predict</a>
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              window.location.href = "/login";
            }}
            className="hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8">Transaction Dashboard </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          

          {/* ⚡ TABLE */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white text-2xl font-bold mb-4">Recent Transactions (Blockchain)</h3>

            <table className="text-white w-full text-left">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="p-2">ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Risk Score</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(t => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-2">{t.id}</td>
                    <td className="p-2">₹{t.amount}</td>
                    <td className="p-2">{t.riskScore}</td>
                    <td
                      className={`p-2 font-bold ${
                        t.status === "BLOCKED" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="p-2">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📈 CHART */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white text-2xl font-bold mb-4">Transaction Trend</h3>

            <LineChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </div>

        </div>
      </div>
    </div>
  );
}
