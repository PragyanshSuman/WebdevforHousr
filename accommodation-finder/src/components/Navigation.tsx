import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button"
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SRM Accommodation</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/search">
                <Button variant="ghost">Search</Button>
              </Link>
              {user.role === 'BROKER' && (
                <Link to="/add-property">
                  <Button variant="ghost">Add Property</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;