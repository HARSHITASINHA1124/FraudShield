import { Link } from "react-router-dom";

export default function Navbar({ dark, setDark, isLoggedIn }) {
  return (
    <nav className="flex justify-between p-4 shadow-lg bg-white dark:bg-gray-800 sticky top-0 z-20">
      <h1 className="text-2xl font-extrabold tracking-wide text-gray-900 dark:text-white">
        FraudShield 
      </h1>

      {isLoggedIn && (<div className="flex gap-4 items-center">
        <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-blue-500 text-white">
          Dashboard
        </Link>

        <Link to="/predict" className="px-4 py-2 rounded-lg bg-purple-500 text-white">
          Predict
        </Link>

        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white dark:bg-yellow-400 dark:text-black"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>)}
    </nav>
  );
}
