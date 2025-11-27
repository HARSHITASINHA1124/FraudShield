import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // -----------------------------
  // Form input change handler
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Email/password signup handler
  // -----------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        navigate("/login"); // redirect to login after successful signup
      }
    } catch (err) {
      setMsg("Signup Failed. Backend might not be running.");
    }

    setLoading(false);
  };

  // -----------------------------
  // Google signup/login handlers
  // -----------------------------
  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google signup/login success:", credentialResponse);

    // Optional: send token to backend
    // fetch("http://localhost:5000/api/auth/google-login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token: credentialResponse.credential }),
    // });

    setMsg("Google login successful!");
    navigate("/dashboard"); // redirect after Google login
  };

  const handleGoogleFailure = () => {
    setMsg("Google login/signup failed");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            type="text"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 outline-none"
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 outline-none"
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 outline-none"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full p-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-semibold transition-all"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Google Signup/Login button */}
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>

        {/* Message display */}
        {msg && (
          <p className="text-center mt-4 text-sm bg-white/20 p-2 rounded-xl">
            {msg}
          </p>
        )}

        {/* Link to login */}
        <p className="mt-4 text-sm text-gray-200 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
