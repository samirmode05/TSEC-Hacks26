
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';

import Landing from './pages/Landing';
import Profile from './components/Profile';
import LogoutButton from './components/LogoutButton';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    return children;
};

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                {/* Navigation Bar */}
                <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                    HackGlobal
                                </span>
                            </div>
                            <div>
                                {user && <LogoutButton />}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
