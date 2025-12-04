import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Mail, Lock, User as UserIcon, Building2, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    college: '',
    role: UserRole.STUDENT
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock Login logic
      const foundUser = MOCK_USERS.find(u => u.email === formData.email);
      if (foundUser) {
        onLogin(foundUser);
      } else {
        // Fallback for demo if user not in mock list but wants to try the UI
        alert("Demo user not found. Trying as a new student.");
        onLogin({
          id: 'temp',
          email: formData.email,
          name: formData.email.split('@')[0],
          role: UserRole.STUDENT,
          lastActive: 'Just now',
          status: 'Active'
        });
      }
    } else {
      // Mock Register Logic
      if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
      }
      onLogin({
        id: `new_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        college: formData.college,
        role: formData.role,
        lastActive: 'Just now',
        status: 'Active'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
         <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 z-10 relative">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg mb-6 text-white">
            <UserIcon className="h-8 w-8 -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your CampusEventHub account' : 'Join CampusEventHub today'}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                  placeholder="College/University Name"
                  value={formData.college}
                  onChange={e => setFormData({...formData, college: e.target.value})}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.STUDENT}>Student</option>
                  <option value={UserRole.COLLEGE_ADMIN}>College Admin</option>
                </select>
              </div>
            </>
          )}

          {isLogin && (
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                 type="email"
                 required
                 className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                 placeholder="Email Address"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
               />
             </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Demo Credentials Helper */}
        {isLogin && (
            <div className="mt-8 pt-6 border-t border-gray-100/60">
                <p className="text-xs text-gray-500 text-center mb-2 font-medium">Quick Demo Access:</p>
                <div className="space-y-1 text-xs text-gray-500 text-center bg-gray-50 p-2 rounded border border-gray-100">
                    <p>Student: <span className="font-mono text-indigo-600">john@university.edu</span> / password123</p>
                    <p>Organizer: <span className="font-mono text-indigo-600">sarah@university.edu</span> / password123</p>
                    <p>Admin: <span className="font-mono text-indigo-600">admin@university.edu</span> / password123</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
