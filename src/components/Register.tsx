import { ArrowRight, User, Mail, School, Lock, Tag } from "lucide-react";
import { useState } from "react";

export function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    interests: [] as string[],
    agreeToTerms: false,
  });

  const interestOptions = [
    "Sports", "Music", "Technology", "Arts", "Business", "Science"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, agreeToTerms: e.target.checked });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: newInterests });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle registration logic here
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
          <div className="col-lg-6 col-md-8">
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
                  <select
                    name="university"
                    className="form-control custom-input"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your university</option>
                    <option value="stanford">Reshma University</option>
                    <option value="harvard">Pallavi University</option>
                    <option value="berkeley">Surya University</option>
                    <option value="oxford">Fareed University</option>
                    <option value="cambridge">Abdulla University</option>
                    <option value="cambridge">Pavan University</option>
                     <option value="cambridge">Priyanshu University</option>
                      <option value="cambridge">Sai University</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Student ID */}
                <div className="form-group">
                  <label className="form-label">
                    <Tag className="label-icon" />
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    className="form-control custom-input"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <Lock className="label-icon" />
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control custom-input"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <Lock className="label-icon" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control custom-input"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
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
                      <a href="#" className="terms-link">Terms & Conditions</a>
                      {" "}and{" "}
                      <a href="#" className="terms-link">Privacy Policy</a>
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
