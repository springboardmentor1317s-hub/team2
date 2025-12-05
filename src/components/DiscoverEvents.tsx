import { Search, Filter, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

export function DiscoverEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Events" },
    { id: "sports", name: "Sports" },
    { id: "fest", name: "Fests" },
    { id: "hackton", name: "Hacktons" },
    { id: "workshop", name: "Workshops" },
    
    
  ];

  const events = [
    {
      id: 1,
      title: "Hackton 2025",
      description: "Code for cause!",
      category: "hackton",
      date: "Dec 15, 2025",
      time: "10:00 AM",
      location: "Main Auditorium",
      attendees: 2,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    {
      id: 2,
      title: "Campus Fest",
      description: "Live performances from student bands and special guest artists.",
      category: "fest",
      date: "Dec 18, 2025",
      time: "6:00 PM",
      location: "Campus Grounds",
      attendees: 567,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    },
    {
      id: 3,
      title: "Basketball Championship Finals",
      description: "Cheer for your team in the most anticipated match of the season.",
      category: "sports",
      date: "Dec 20, 2025",
      time: "3:00 PM",
      location: "Sports Arena",
      attendees: 892,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    },
    {
      id: 4,
      title: "Workshop 2025",
      description: "Where Ideas Turn Into Action.",
      category: "workshop",
      date: "Dec 22, 2025",
      time: "2:00 PM",
      location: "Seminar Hall",
      attendees: 156,
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    },
    
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="discover-section">
      {/* Animated Background */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
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

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="container discover-content">
        {/* Header */}
        <div className="discover-header">
          <h1 className="discover-title">Discover Events</h1>
          <p className="discover-subtitle">
            Find and join exciting events happening around your campus
          </p>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search events, keywords, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <button className="btn btn-filter">
                <Filter className="filter-icon" />
                 Filter it
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="category-chips">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          <div className="row g-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="col-lg-4 col-md-6">
                <div className="event-card">
                  <div className="event-image-wrapper">
                    <img src={event.image} alt={event.title} className="event-image" />
                    <div className="event-category-badge">{event.category}</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    
                    <div className="event-meta">
                      <div className="meta-item">
                        <Calendar className="meta-icon" />
                        <span>{event.date}</span>
                      </div>
                      <div className="meta-item">
                        <Clock className="meta-icon" />
                        <span>{event.time}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin className="meta-icon" />
                        <span>{event.location}</span>
                      </div>
                      <div className="meta-item">
                        <Users className="meta-icon" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <button className="btn btn-event-details">
                      View Details
                      <ArrowRight className="btn-icon-small" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
