import { Calendar, Sparkles } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  return (
    <header className="header-main">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4">
            {/* Logo */}
            <div className="logo-container" onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
              <div className="logo-icon-wrapper">
                <div className="logo-glow"></div>
                <div className="logo-icon">
                  <Calendar className="icon" />
                </div>
              </div>
              <div className="logo-text">
                <span className="logo-main">CampusEvent</span>
                <span className="logo-accent">Hub</span>
                <span className="logo-sparkle">
                  <Sparkles className="sparkle-icon" />
                </span>
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            {/* Navigation */}
            <nav className="navbar-custom">
              <ul className="nav-list">
                <li className="nav-item">
                  <a 
                    href="#" 
                    className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("home");
                    }}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#" 
                    className={`nav-link ${currentPage === "discover" ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("discover");
                    }}
                  >
                    Discover Events
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#" 
                    className={`nav-link ${currentPage === "register" ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("register");
                    }}
                  >
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#" 
                    className="nav-link btn-login"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage("login");
                    }}
                  >
                    Login
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
