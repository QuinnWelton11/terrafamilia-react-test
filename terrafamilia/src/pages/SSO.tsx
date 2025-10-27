import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Navigation";
import Cover from "../components/CoverImg";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  country: string;
  state_province: string;
  phone_number: string;
}

function SSO() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    country: "",
    state_province: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/the-commons");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null); // Clear message when user types
  };

  const validateForm = (): boolean => {
    if (!isLogin) {
      // Registration validation
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.full_name ||
        !formData.country ||
        !formData.state_province
      ) {
        setMessage({
          type: "error",
          text: "Please fill in all required fields",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return false;
      }

      if (formData.password.length < 8) {
        setMessage({
          type: "error",
          text: "Password must be at least 8 characters long",
        });
        return false;
      }

      if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) {
        setMessage({
          type: "error",
          text: "Username must be 3-30 characters and contain only letters, numbers, and underscores",
        });
        return false;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setMessage({
          type: "error",
          text: "Please enter a valid email address",
        });
        return false;
      }
    } else {
      // Login validation - use email for login
      if (!formData.email || !formData.password) {
        setMessage({
          type: "error",
          text: "Please enter email and password",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Sign in with email instead of username
        const success = await signIn(formData.email, formData.password);

        if (success) {
          setMessage({
            type: "success",
            text: "Login successful! Redirecting...",
          });
          setTimeout(() => navigate("/the-commons"), 1500);
        } else {
          setMessage({
            type: "error",
            text: "Invalid email or password",
          });
        }
      } else {
        // Sign up with all user data
        const success = await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          full_name: formData.full_name,
          country: formData.country,
          state_province: formData.state_province,
          phone_number: formData.phone_number || undefined,
        });

        if (success) {
          setMessage({
            type: "success",
            text: "Registration successful! Redirecting...",
          });
          setTimeout(() => navigate("/the-commons"), 1500);
        } else {
          setMessage({
            type: "error",
            text: "Registration failed. Please try again.",
          });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      country: "",
      state_province: "",
      phone_number: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <Cover />

      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="max-w-md mx-auto bg-slate-50/95 rounded-lg shadow-md overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-slate-800 text-slate-100 p-6 text-center">
            <h1 className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Join Terrafamilia"}
            </h1>
            <p className="text-slate-300 mt-2">
              {isLogin
                ? "Sign in to your account"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Username (Registration only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}

            {/* Full Name (Registration only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Country and State (Registration only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Country"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state_province"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state_province"
                    name="state_province"
                    value={formData.state_province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="State/Province"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number (Registration only, optional) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password {!isLogin && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
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
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="bg-slate-100/80 px-6 py-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-700">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SSO;
