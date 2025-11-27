import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ handleLogin: parentLogin, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // -----------------------------
  // Google Login Success
  // -----------------------------
  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);

    // Mark user as logged in
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");  // persist login
    setMsg("Google login successful!");
    navigate("/dashboard");


    
  };


  const handleGoogleFailure = () => {
    setMsg("Google login failed");
  };


  return (
    <AnimatePresence>
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 w-full max-w-md text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Welcome to FraudShield</h2>

          {/* email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-gray-200 dark:bg-gray-700"
          />

          {/* password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded-lg bg-gray-200 dark:bg-gray-700"
          />

          {/* login button */}
          <button
            onClick={() => parentLogin(email, password)}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-bold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Google Login */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          </div>

          {msg && <p className="mt-4 text-sm text-red-500">{msg}</p>}

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
