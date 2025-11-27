import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Predict from "./pages/Predict.jsx";

export default function App() {
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [transactions] = useState([
    { id: 1, amount: 500, status: "Success", date: "2025-11-27" },
    { id: 2, amount: 1200, status: "Fraud", date: "2025-11-26" },
    { id: 3, amount: 300, status: "Success", date: "2025-11-25" },
  ]);

  const [chartData] = useState([
    { date: "2025-11-25", amount: 300 },
    { date: "2025-11-26", amount: 1200 },
    { date: "2025-11-27", amount: 500 },
  ]);

  const [result, setResult] = useState("");

  // 🔥 PERSIST LOGIN
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className={`${dark ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      <BrowserRouter>

        {/* Navbar only if logged in */}
        {isLoggedIn && <Navbar dark={dark} setDark={setDark} />}

        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<LoginWrapper setIsLoggedIn={setIsLoggedIn} />} />

          {/* SIGNUP */}
          <Route path="/signup" element={<Signup />} />

          {/* DASHBOARD (protected) */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn
                ? <Dashboard transactions={transactions} chartData={chartData} />
                : <LoginWrapper setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* PREDICT (protected) */}
          <Route
            path="/predict"
            element={
              isLoggedIn
                ? <Predict result={result} setResult={setResult} />
                : <LoginWrapper setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<LoginWrapper setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}



// ✨ Wrapper for Login.jsx
function LoginWrapper({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");  // persistent login

        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Backend not running or network error");
    }
  };

  return (
    <Login
      handleLogin={handleLogin}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}
