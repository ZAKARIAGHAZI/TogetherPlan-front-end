import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register = () => {
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [name, email, password, passwordConfirmation]);

  // ✅ Redirect user after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Name is required.";

    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!passwordConfirmation)
      newErrors.passwordConfirmation = "Confirm your password.";
    else if (password !== passwordConfirmation)
      newErrors.passwordConfirmation = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(
        registerUser({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-blue-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Start your journey with us today ✨
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <strong>Registration Failed:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ${
                errors.passwordConfirmation
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.passwordConfirmation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.passwordConfirmation}
              </p>
            )}
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
