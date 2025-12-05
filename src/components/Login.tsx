import { ArrowRight, Mail, Lock, Github, Chrome } from "lucide-react";
import { useState } from "react";

interface LoginProps {
  setCurrentPage: (page: string) => void;
}

export function Login({ setCurrentPage }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Handle login logic here
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
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="container register-content">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
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
                  <input
                    type="password"
                    name="password"
                    className="form-control custom-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
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
