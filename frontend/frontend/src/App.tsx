// frontend/src/App.tsx (FIXED)

import React, { useState, useEffect } from 'react';
// Assuming Login, Register, and Dashboard are imported from components
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard'; 
import EventForm from './components/EventForm';
import EventCard from './components/EventCard';
import ChatBot from './components/chatbot';
import { WhatsAppBtn } from './components/WhatsAppBtn';




// Define the pages for clarity
type AppPages = 'login' | 'register' | 'dashboard' | 'discover';

export default function App() {
    // 1. Authentication State: Check for token on load
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // 2. Page Navigation State
    const [currentPage, setCurrentPage] = useState<AppPages>('login');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Check localStorage for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!isAuthenticated && token) {
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
        }else if (!token) {
        // If there's no token, ensure the state is correctly logged out.
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentPage('login');
        }

    }, [isAuthenticated]);

    // --- Core Functions ---

    const handleLoginSuccess = (user: any) => {
        setTimeout(() => {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentPage('dashboard');
        console.log("State updated. Should redirect to dashboard.");
        }, 0);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentPage('login');
        console.log("User logged out.");
    };

    // --- Render Logic ---

    const renderPage = () => {
        if (isAuthenticated && currentPage === 'dashboard' && currentUser) {
            return (
                <Dashboard 
                    user={currentUser} 
                    handleLogout={handleLogout} 
                    setCurrentPage={setCurrentPage}
                />
            );
        }
        
        if (isAuthenticated && currentPage === 'discover') {
            return <DiscoverEvents />; 
        }
        
        if (currentPage === 'register') {
            return <Register setCurrentPage={setCurrentPage} onRegistrationSuccess={handleLoginSuccess} />; 
        }

        // Default to Login page
        return <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
    };

    return (
        <div className="app-container relative">
            {/* 1. Render the main page content */}
            {renderPage()}
            
            {/* 2. Render floating widgets conditionally (e.g., only if logged in) */}
            {isAuthenticated && (
                <>
                    {/* The WhatsApp button will render on top of the main page */}
                    <WhatsAppBtn />
                    
                    {/* The ChatBot widget will also render persistently */}
                    <ChatBot />
                </>
            )}
        </div>
    );
}

// NOTE: You will need to export and render <App /> in your main entry file (main.tsx)