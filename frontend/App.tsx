import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, LayoutDashboard, Calendar, Search, Filter, Bell, Menu, X, ChevronDown, User as UserIcon } from 'lucide-react';
import { User, Event, UserRole, Registration } from './types';
import { MOCK_USERS, MOCK_EVENTS, MOCK_REGISTRATIONS } from './constants';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import Dashboard from './components/Dashboard';
import EventForm from './components/EventForm';
import AuthPage from './components/AuthPage';

// --- Internal Auth Page Component (Wrapper to pass props) ---
interface AuthWrapperProps {
  onLogin: (user: User) => void;
}

// --- Main App Component ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(MOCK_REGISTRATIONS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for stored user on app mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleCreateEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      ...eventData,
      id: `e${events.length + 1}`,
      collegeId: currentUser?.college || 'unknown',
      status: 'upcoming',
      tags: ['new'],
      imageUrl: eventData.imageUrl || 'https://picsum.photos/800/400',
      participantsCount: 0,
      maxParticipants: eventData.maxParticipants || 100,
      createdAt: new Date().toISOString()
    } as Event;
    
    setEvents([newEvent, ...events]);
  };

  const handleRegister = (eventId: string) => {
      if(!currentUser) return;
      
      const newReg: Registration = {
          id: `r${registrations.length + 1}`,
          eventId,
          userId: currentUser.id,
          status: 'pending',
          timestamp: new Date().toISOString()
      };
      setRegistrations([...registrations, newReg]);

      // Update event participant count locally for UI
      setEvents(events.map(e => e.id === eventId ? {...e, participantsCount: e.participantsCount + 1} : e));
  };

  return (
    <Router>
      {!currentUser ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <Layout 
            user={currentUser} 
            onLogout={handleLogout} 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        >
          <Routes>
            <Route path="/" element={<Navigate to={currentUser?.role === UserRole.STUDENT ? "/student-dashboard" : currentUser?.role === UserRole.SUPER_ADMIN ? "/admin" : "/dashboard"} replace />} />
            <Route 
                path="/events" 
                element={
                    <EventsPage 
                        events={events} 
                        user={currentUser} 
                        registrations={registrations}
                        onRegister={handleRegister}
                    />
                } 
            />
            <Route 
                path="/student-dashboard" 
                element={
                    currentUser?.role === UserRole.STUDENT ? (
                        <DashboardPage 
                            user={currentUser} 
                            events={events} 
                            registrations={registrations}
                            onCreateEvent={handleCreateEvent}
                        />
                    ) : (
                        <Navigate to={currentUser?.role === UserRole.SUPER_ADMIN ? "/admin" : "/dashboard"} replace />
                    )
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    currentUser?.role === UserRole.COLLEGE_ADMIN ? (
                        <DashboardPage 
                            user={currentUser} 
                            events={events} 
                            registrations={registrations}
                            onCreateEvent={handleCreateEvent}
                        />
                    ) : (
                        <Navigate to={currentUser?.role === UserRole.STUDENT ? "/student-dashboard" : "/admin"} replace />
                    )
                } 
            />
            <Route 
                path="/admin" 
                element={
                    currentUser?.role === UserRole.SUPER_ADMIN ? (
                        <DashboardPage 
                            user={currentUser} 
                            events={events} 
                            registrations={registrations}
                            onCreateEvent={handleCreateEvent}
                        />
                    ) : (
                        <Navigate to={currentUser?.role === UserRole.STUDENT ? "/student-dashboard" : "/dashboard"} replace />
                    )
                } 
            />
            <Route path="*" element={<Navigate to={currentUser?.role === UserRole.STUDENT ? "/student-dashboard" : currentUser?.role === UserRole.SUPER_ADMIN ? "/admin" : "/dashboard"} replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

// --- Sub-components for cleaner structure ---

const Layout: React.FC<{ 
    user: User, 
    onLogout: () => void, 
    children: React.ReactNode,
    isMobileMenuOpen: boolean,
    setIsMobileMenuOpen: (v: boolean) => void
}> = ({ user, onLogout, children, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <button
                onClick={() => {
                    navigate(to);
                    setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
            >
                <Icon className="w-4 h-4" />
                {label}
            </button>
        );
    };

    // Determine background based on route
    const getBgClass = () => {
        if (location.pathname.includes('dashboard')) {
            return 'bg-slate-100 bg-dot-pattern'; // Admin/Dashboard: Dots on Slate
        }
        // Fresh Blue/Indigo Gradient for Events - Clean and Distinct
        return 'bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50'; 
    };

    return (
        <div className={`min-h-screen ${getBgClass()} flex flex-col transition-all duration-300`}>
            {/* Navbar */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-1.5 rounded-lg group-hover:shadow-lg transition-shadow">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">CampusEventHub</span>
                            </div>
                            
                            <nav className="hidden md:flex items-center gap-1">
                                <NavItem to="/events" icon={Search} label="All Events" />
                                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            
                            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                                </div>
                                <div className="h-9 w-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <button 
                                    onClick={onLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>

                            <button 
                                className="md:hidden p-2 text-gray-500"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white absolute w-full z-40 shadow-lg">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <NavItem to="/events" icon={Search} label="All Events" />
                            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <button onClick={onLogout} className="text-red-600 p-2">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {children}
            </main>
        </div>
    );
};

const EventsPage: React.FC<{ 
    events: Event[], 
    user: User, 
    registrations: Registration[],
    onRegister: (id: string) => void
}> = ({ events, user, registrations, onRegister }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Types');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedDateRange, setSelectedDateRange] = useState('All Dates');
    const [selectedModalEvent, setSelectedModalEvent] = useState<Event | null>(null);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Types' || event.category === selectedCategory.toLowerCase();
        const matchesStatus = selectedStatus === 'All Status' || event.status === selectedStatus.toLowerCase();
        
        let matchesDate = true;
        // Simple mock implementation of date filtering
        if (selectedDateRange !== 'All Dates') {
            const eventDate = new Date(event.startDate);
            const today = new Date();
            if (selectedDateRange === 'Today') {
                matchesDate = eventDate.toDateString() === today.toDateString();
            } else if (selectedDateRange === 'This Week') {
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                matchesDate = eventDate >= today && eventDate <= nextWeek;
            } else if (selectedDateRange === 'This Month') {
                matchesDate = eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
            }
        }

        return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });

    const isRegistered = (eventId: string) => registrations.some(r => r.eventId === eventId && r.userId === user.id);

    return (
        <div className="space-y-8">
            {/* Hero / Filter Section */}
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8">
                {/* Decorative background elements inside the card */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
                
                <div className="relative z-10">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            Discover Events<span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl">
                            Browse upcoming hackathons, cultural fests, and sports championships across top universities.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                         {/* Search */}
                         <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:bg-white group-hover:shadow-md"
                                placeholder="Search events, colleges, or topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Filters Row */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <select 
                                    className="appearance-none bg-gray-50 hover:bg-white border-transparent py-3.5 pl-10 pr-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all cursor-pointer font-medium text-gray-700 w-full sm:w-auto hover:shadow-md"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option>All Types</option>
                                    <option value="hackathon">Hackathon</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="sports">Sports</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-gray-50 hover:bg-white border-transparent py-3.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all cursor-pointer font-medium text-gray-700 w-full sm:w-auto hover:shadow-md"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option>All Status</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="relative group">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <select 
                                    className="appearance-none bg-gray-50 hover:bg-white border-transparent py-3.5 pl-10 pr-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm transition-all cursor-pointer font-medium text-gray-700 w-full sm:w-auto hover:shadow-md"
                                    value={selectedDateRange}
                                    onChange={(e) => setSelectedDateRange(e.target.value)}
                                >
                                    <option>All Dates</option>
                                    <option>Today</option>
                                    <option>This Week</option>
                                    <option>This Month</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={setSelectedModalEvent} 
                    />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="bg-indigo-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">We couldn't find any events matching your search. Try adjusting your filters or search terms.</p>
                </div>
            )}

            <EventModal 
                event={selectedModalEvent} 
                isOpen={!!selectedModalEvent} 
                onClose={() => setSelectedModalEvent(null)}
                onRegister={() => selectedModalEvent && onRegister(selectedModalEvent.id)}
                isRegistered={selectedModalEvent ? isRegistered(selectedModalEvent.id) : false}
            />
        </div>
    );
};

const DashboardPage: React.FC<{ 
    user: User, 
    events: Event[], 
    registrations: Registration[],
    onCreateEvent: (e: Partial<Event>) => void 
}> = ({ user, events, registrations, onCreateEvent }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Filter events for the dashboard based on role
    const dashboardEvents = user.role === UserRole.COLLEGE_ADMIN 
        ? events.filter(e => e.collegeId === user.college)
        : events; 
    
    const myRegistrations = registrations.filter(r => r.userId === user.id);
    const myRegisteredEventIds = myRegistrations.map(r => r.eventId);
    const myEvents = events.filter(e => myRegisteredEventIds.includes(e.id));

    return (
        <>
            <Dashboard 
                user={user} 
                events={user.role === UserRole.STUDENT ? myEvents : dashboardEvents} 
                registrations={user.role === UserRole.STUDENT ? myRegistrations : registrations}
                onCreateEventClick={() => setIsFormOpen(true)}
            />
            {isFormOpen && (
                <EventForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={(data) => {
                        onCreateEvent(data);
                        setIsFormOpen(false);
                    }} 
                />
            )}
        </>
    );
};

export default App;
