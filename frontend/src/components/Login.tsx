import {
  ArrowRight,
  Mail,
  Lock,
  Github,
  Chrome,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

interface LoginProps {
  setCurrentPage: (page: string) => void;
  onLoginSuccess: (user: any) => void;
}

export function Login({ setCurrentPage, onLoginSuccess }: LoginProps) {
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // 1. READ THE RESPONSE BODY ONCE HERE.
      const responseData = await response.json();

      if (response.ok) {
        // Success: status is 200-299
        console.log("Login Successful:", responseData.message);
        localStorage.setItem("token", responseData.token);
        // Assuming this function is passed down from App.tsx
        onLoginSuccess(responseData.user);
      } else {
        // Failure: status is 400 or 500. The error message is already in the 'data' object.
        console.error("Login Failed:", responseData.message);
        alert(
          `Login Failed: ${
            responseData.message || "An unexpected error occurred."
          }`
        );
      }
    } catch (error) {
      console.error("Network Error or Stream Failure:", error);
      alert("Failed to connect to the server.");
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
                <h1 className="register-title">Welcome Back</h1>
                <p className="register-subtitle">
                  Sign in to continue to CampusEventHub
                </p>
              </div>

              {/* Social Login */}
              <div className="social-login">
                <button className="btn btn-social">
                  <Chrome className="social-icon" />
                  Continue with Google
                </button>
                <button className="btn btn-social">
                  <Github className="social-icon" />
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
                <p className="login-link">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="link-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("register");
                    }}
                  >
                    Register here
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
