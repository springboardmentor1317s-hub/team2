import { ArrowRight, Calendar, Users, Zap } from "lucide-react";

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

export function Hero({ setCurrentPage }: HeroProps) {
  const features = [
    {
      icon: Calendar,
      title: "Easy Discovery",
      description: "Find events that match your interests instantly",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with peers and build lasting memories",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Never miss out on exciting campus happenings",
    },
  ];

  return (
    <div className="hero-section">
      {/* Animated Background Particles */}
      <div className="particles-container">
        {[...Array(30)].map((_, i) => (
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

      <div className="container hero-content">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            {/* Tagline */}
            <div className="tagline">
              <Zap className="tagline-icon" />
              <span> Inter-College Event Management Platform</span>
            </div>

            {/* Main Quote */}
            <h1 className="hero-title">
              <span className="title-line-1">One Platform</span>
              <span className="title-line-2">Endless Events</span>
            </h1>

            {/* Subheading */}
            <p className="hero-subtitle">
              Connect, discover, and participate in campus events like never before.
              Your journey to unforgettable experiences starts here.
            </p>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <button 
                className="btn btn-primary-custom"
                onClick={() => setCurrentPage("register")}
              >
                Get Started
                <ArrowRight className="btn-icon" />
              </button>
              <button className="btn btn-secondary-custom">
                Learn More
              </button>
            </div>

            {/* Feature Cards */}
            <div className="row mt-5 feature-cards">
              {features.map((feature, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <feature.icon className="feature-icon" />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}