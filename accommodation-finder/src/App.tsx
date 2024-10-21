import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./components/ui/button"
import { Home, LogIn, LogOut, Search, Upload } from 'lucide-react'
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import BrokerDashboard from './components/BrokerDashboard';
import AccommodationDetails from './components/AccommodationDetails';
import { login as apiLogin, signup as apiSignup } from './services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'BROKER';
}

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: 'USER' | 'BROKER') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await apiLogin(username, password);
      if (response && response.token && response.user) {
        const { token, user } = response;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        toast.success('Login successful!');
        navigate(user.role === 'BROKER' ? '/upload' : '/search');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
      throw error;
    }
  };

  const handleSignup = async (username: string, email: string, password: string, role: 'USER' | 'BROKER') => {
    try {
      const response = await apiSignup(username, email, password, role);
      if (response && response.token && response.user) {
        const { token, user } = response;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        toast.success('Signup successful!');
        navigate(user.role === 'BROKER' ? '/upload' : '/search');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error) {
        toast.error(`Signup failed: ${error.message}`);
      } else {
        toast.error('Signup failed. Please try again.');
      }
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('You have been logged out.');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, signup: handleSignup, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Home className="mr-2" />
          SRM Accommodation Finder
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:inline">Welcome, {user.username}</span>
              {user.role === 'USER' && (
                <Link to="/search">
                  <Button variant="ghost" className="flex items-center">
                    <Search className="mr-2" />
                    Search
                  </Button>
                </Link>
              )}
              {user.role === 'BROKER' && (
                <Link to="/upload">
                  <Button variant="ghost" className="flex items-center">
                    <Upload className="mr-2" />
                    Upload
                  </Button>
                </Link>
              )}
              <Button onClick={logout} variant="secondary" className="flex items-center">
                <LogOut className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" state={{ from: location }}>
              <Button variant="secondary" className="flex items-center">
                <LogIn className="mr-2" />
                Login / Sign Up
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'BROKER']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute allowedRoles={['BROKER']}>
                <BrokerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/accommodation/:id" element={<AccommodationDetails />} />
        </Routes>
      </main>
      <footer className="bg-secondary text-secondary-foreground mt-8">
        <div className="container mx-auto py-4 px-4 text-center">
          &copy; {new Date().getFullYear()} SRM Accommodation Finder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('USER' | 'BROKER')[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </Router>
  );
};

export default App;