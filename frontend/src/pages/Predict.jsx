import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Predict({ result, setResult }) {
  const [formData, setFormData] = useState({
    step: 1,
    type: "TRANSFER",
    amount: 0,
    nameOrig: "",
    oldbalanceOrg: 0,
    newbalanceOrg: 0,
    nameDest: "",
    oldbalanceDest: 0,
    newbalanceDest: 0,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data);

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setResult({ error: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Check Transaction Risk</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="number" name="step" value={formData.step} onChange={handleChange} placeholder="Step" className="w-full p-2 border rounded" />

        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="TRANSFER">TRANSFER</option>
          <option value="CASH_OUT">CASH_OUT</option>
          <option value="PAYMENT">PAYMENT</option>
          <option value="DEBIT">DEBIT</option>
          <option value="CASH_IN">CASH_IN</option>
        </select>

        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full p-2 border rounded" />
        <input type="text" name="nameOrig" value={formData.nameOrig} onChange={handleChange} placeholder="Origin Name" className="w-full p-2 border rounded" />
        <input type="number" name="oldbalanceOrg" value={formData.oldbalanceOrg} onChange={handleChange} placeholder="Old Balance Orig" className="w-full p-2 border rounded" />
        <input type="number" name="newbalanceOrg" value={formData.newbalanceOrg} onChange={handleChange} placeholder="New Balance Orig" className="w-full p-2 border rounded" />
        <input type="text" name="nameDest" value={formData.nameDest} onChange={handleChange} placeholder="Destination Name" className="w-full p-2 border rounded" />
        <input type="number" name="oldbalanceDest" value={formData.oldbalanceDest} onChange={handleChange} placeholder="Old Balance Dest" className="w-full p-2 border rounded" />
        <input type="number" name="newbalanceDest" value={formData.newbalanceDest} onChange={handleChange} placeholder="New Balance Dest" className="w-full p-2 border rounded" />

        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {loading ? "Checking..." : "Check Risk"}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          {result.error ? (
            <p className="text-red-500">Error: {result.error}</p>
          ) : (
            <>
              <p>Risk Score: {result.riskScore}</p>
              <p>Status: {result.status}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
