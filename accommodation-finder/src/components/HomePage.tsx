import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useAuth } from '../App';
import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (!user) {
      toast.info('Please sign in to search for accommodations');
      navigate('/login');
    } else {
      navigate('/search');
    }
  };

  const handleAddPropertyClick = () => {
    if (!user) {
      toast.info('Please sign in to add a property');
      navigate('/login');
    } else if (user.role === 'USER') {
      toast.error('Only property owners can add properties');
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Find Your Perfect Student Accommodation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>For Students</CardTitle>
            <CardDescription>Find the best accommodation near SRM University</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Browse through a wide range of options tailored for students like you.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSearchClick}>Start Searching</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Property Owners</CardTitle>
            <CardDescription>List your property and reach thousands of students</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Easily upload and manage your property listings to find the perfect tenants.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAddPropertyClick}>List Your Property</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default HomePage;