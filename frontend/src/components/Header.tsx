import { LogOut, LayoutDashboard, Compass, User } from "lucide-react";
import React from 'react';

// NOTE: Since this Header is meant for authenticated users, 
// it assumes the user is logged in (used on Discover page).

interface HeaderProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    handleLogout: () => void;
    // The user object is needed to display the name
    userName: string; 
}

export function Header({ currentPage, setCurrentPage, userName, handleLogout }: HeaderProps) {
    return (
        // The custom 'header-main' class is retained for your custom animation/fixed position
        <header className="header-main">
            
            {/* max-w-7xl mx-auto centers content, flex organizes children horizontally */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
                
                {/* Left Section: Logo/Title */}
                <div 
                    className="flex-shrink-0 flex items-center space-x-2 cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => setCurrentPage("dashboard")} 
                >
                    {/* Replaced complex logo with simplified icon and text for better UI */}
                    <div className="p-2 rounded-full bg-indigo-600 text-white shadow-md">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-extrabold text-white tracking-tight hidden sm:inline">CampusEventHub</span>
                </div>
                
                {/* Right Section: Navigation and Actions */}
                <nav className="flex items-center space-x-4 sm:space-x-6">
                    
                    {/* 1. Dashboard Link */}
                    <button 
                        onClick={() => setCurrentPage("dashboard")}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-medium 
                            ${currentPage === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-gray-300 hover:bg-gray-700"}`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> 
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                    
                    {/* 2. Discover Events Link */}
                    <button 
                        onClick={() => setCurrentPage("discover")}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-medium 
                            ${currentPage === "discover" ? "bg-indigo-50 text-indigo-700" : "text-gray-300 hover:bg-gray-700"}`}
                    >
                        <Compass className="w-5 h-5" /> 
                        <span className="hidden sm:inline">Discover</span>
                    </button>

                    {/* User Info (Visible on desktop) */}
                    <div className="hidden md:flex items-center space-x-2 text-gray-200">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium whitespace-nowrap">Hi, {userName}!</span>
                    </div>

                    {/* Logout Button (Styled for visibility against the dark background) */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-md"
                    >
                        <LogOut className="w-5 h-5" /> 
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </nav>
            </div>
        </header>
    );
}