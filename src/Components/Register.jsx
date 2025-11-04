import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// Import the registerUser thunk action from your authSlice
import { registerUser } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";

// Helper function for basic email validation
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Register = () => {
  // Redux state selectors
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  // Local component state for form inputs and validation errors
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Bonus
  const [errors, setErrors] = useState({});

  // Effect to clear errors when input changes
  useEffect(() => {
    setErrors({});
  }, [name, email, password, passwordConfirmation]);

  // Effect to handle redirection or success message upon successful registration
  useEffect(() => {
    if (isAuthenticated) {
      // **TODO: Add logic for redirection (e.g., to dashboard) here**
      console.log("User successfully registered and authenticated!");
    }
  }, [isAuthenticated]);

  // Client-side form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Confirm your password.";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Dispatch the registerUser async thunk with user data
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
    // Main container for the page, centered content
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Start your journey with us today.
        </p>

        {/* Display Redux global error */}
        {error && (
          <div
            className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            <span className="font-medium">Registration Failed:</span> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out sm:text-sm ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out sm:text-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out sm:text-sm ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Password Confirmation Field (Bonus) */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out sm:text-sm ${
                  errors.passwordConfirmation
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="mt-2 text-sm text-red-600">
                {errors.passwordConfirmation}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-200 ease-in-out ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                // Loading Indicator
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        {/* Switch to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
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
