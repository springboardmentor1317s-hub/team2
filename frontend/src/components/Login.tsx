import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BsGithub } from "react-icons/bs";
import { GoogleLogin } from "@react-oauth/google";
import { BASE_URL } from "../App";

interface LoginProps {
  setCurrentPage: (page: string) => void;
  onLoginSuccess: (user: any) => void;
  handleLoginWithGoogle: (code: any) => void;
}

export function Login({
  setCurrentPage,
  onLoginSuccess,
  handleLoginWithGoogle,
}: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // frontend/src/components/Login.tsx (Revised handleSubmit function)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        // for accessing the token from cookie
        credentials: "include",
      });

      // 1. READ THE RESPONSE BODY ONCE HERE.
      const responseData = await response.json();

      if (response.ok) {
        // Success: status is 200-299
        toast.success(responseData.message);
        // Assuming this function is passed down from App.tsx
        onLoginSuccess(responseData.user);
      } else {
        // Failure: status is 400 or 500. The error message is already in the 'data' object.
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Network Error or Stream Failure:", error);
    }
  };

  return (
    <div className="register-section">
      {/* Animated Background Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="container register-content">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-5">
            <div className="register-card">
              {/* Header */}
              <div className="register-header">
                <h1 className="text-[32px] font-sans text-[#76DCFA] font-bold mb-2">Welcome Back</h1>
                <p className="text-[#94a3b8]">
                  Sign in to continue to CampusEventHub
                </p>
              </div>

              {/* Social Login */}
              <div className="social-login">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleLoginWithGoogle(credentialResponse.credential);
                  }}
                  theme="outline"
                  text="continue_with"
                  shape="rectangular"
                  logo_alignment="center"
                  onError={() => {
                    toast.error("Login Failed");
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:5000/api/auth/github")
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-[15px] text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <BsGithub />
                  Continue with GitHub
                </button>
              </div>

              <div className="divider">
                <span className="divider-text">Or sign in with email</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="register-form">
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    <Mail className="label-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control custom-input"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">
                    <Lock className="label-icon" />
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control custom-input"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="gray" />
                      ) : (
                        <Eye size={20} color="gray" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-group remember-forgot">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-register">
                  Sign In
                  <ArrowRight className="btn-icon" />
                </button>

                {/* Register Link */}
                <p className="text-[#94a3b8] text-center login-link">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="link-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("register");
                    }}
                  >
                    Sign up here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
