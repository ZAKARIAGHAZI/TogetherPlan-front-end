import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [email, password]);

  // ✅ Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // redirect to dashboard page
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-blue-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to access your account
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <strong>Login Failed:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-lg text-sm font-medium text-white transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
