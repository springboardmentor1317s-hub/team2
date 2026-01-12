import {
  ArrowRight,
  User,
  Mail,
  School,
  Lock,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

// Add props definition to Register if you want to switch to login view on success
interface RegisterProps {
  setCurrentPage: (page: string) => void;
  onRegistrationSuccess: (user: any) => void;
}

// Update the function signature to accept the props
export function Register({
  setCurrentPage,
  onRegistrationSuccess,
}: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    role: "student",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, agreeToTerms: e.target.checked });
  };

  // 🚀 UPDATED SUBMIT HANDLER FOR API INTEGRATION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Error: Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Error: You must agree to the Terms & Conditions.");
      return;
    }

    // Destructure the data we need, excluding the client-side only fields
    const { confirmPassword, agreeToTerms, ...dataToSend } = formData;
// 💡 NEW DIAGNOSTIC LINE
   /* console.log('Payload being sent:', JSON.stringify(dataToSend)); */
    // 2. API Call
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

       const responseData = await response.json();
       
      if (response.ok) {
       
        localStorage.setItem("token", responseData.token);
        console.log("Registration successful, redirecting..."); // New log for confirmation
        
        
        // 🔑 Trigger the success handler to redirect to Dashboard
        onRegistrationSuccess(responseData.user);
      } else {
        // Handle errors like 'User already exists'
        console.error("Registration Failed:", responseData.message);
        alert(`Registration Failed: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the server. Please check your backend.");
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
                <h1 className="register-title">Create Account</h1>
                <p className="register-subtitle">
                  Join CampusEventHub and start discovering amazing events
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="register-form">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    <User className="label-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control custom-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

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

                {/* University */}
                <div className="form-group">
                  <label className="form-label">
                    <School className="label-icon" />
                    University/Campus
                  </label>
                  <input
                    type="text"
                    name="university"
                    className="form-control custom-input"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* role Select */}
                <div className="form-group">
                  <label className="form-label">
                    <Tag className="label-icon" />
                    Role
                  </label>
                  <select
                    name="role"
                    className="form-control custom-input"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="student">student</option>
                    <option value="admin">Admin</option>

                  </select>
                </div>

                {/* Password */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Lock className="label-icon" /> Password
                      </label>

                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control custom-input pe-5"
                          placeholder="Create password"
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
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Lock className="label-icon" /> Confirm Password
                      </label>

                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          className="form-control custom-input pe-5"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />

                        <button
                          type="button"
                          className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} color="gray" />
                          ) : (
                            <Eye size={20} color="gray" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="form-group">
                  <div className="form-check custom-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the{" "}
                      <a href="#" className="terms-link">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="terms-link">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-register">
                  Create Account
                  <ArrowRight className="btn-icon" />
                </button>

                {/* Login Link */}
                <p className="login-link">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="link-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("login");
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
