import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Search, MapPin, DollarSign, Wifi, Coffee, Car } from 'lucide-react'
import { Link } from 'react-router-dom';
import { getAllAccommodations } from '../services/api';

// Types
type Accommodation = {
  id: number
  title: string
  address: string
  price: number
  distanceFromUniversity: number
  amenities: string[]
  photos: string[]
  contactEmail: string
  contactPhone: string
  brokerId: number
}

const AccommodationCard: React.FC<{ accommodation: Accommodation }> = ({ accommodation }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle>{accommodation.title}</CardTitle>
      <CardDescription className="flex items-center">
        <MapPin className="w-4 h-4 mr-1" />
        {accommodation.address}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <img src={accommodation.photos[0]} alt={accommodation.title} className="w-full h-48 object-cover mb-4 rounded-md" />
      <div className="space-y-2">
        <p className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          ₹{accommodation.price}/month
        </p>
        <p className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {accommodation.distanceFromUniversity} km from SRM
        </p>
        <div className="flex flex-wrap gap-2">
          {accommodation.amenities.map((amenity, index) => (
            <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
              {amenity === 'Wi-Fi' && <Wifi className="w-3 h-3 mr-1" />}
              {amenity === 'AC' && <Coffee className="w-3 h-3 mr-1" />}
              {amenity === 'Parking' && <Car className="w-3 h-3 mr-1" />}
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Link to={`/accommodation/${accommodation.id}`} className="w-full">
        <Button className="w-full">View Details</Button>
      </Link>
    </CardFooter>
  </Card>
)

const AccommodationList: React.FC<{ accommodations: Accommodation[] }> = ({ accommodations }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {accommodations.map((accommodation) => (
      <AccommodationCard key={accommodation.id} accommodation={accommodation} />
    ))}
  </div>
)

const UserDashboard: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price')

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await getAllAccommodations();
        setAccommodations(response.data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };
    fetchAccommodations();
  }, [])

  const filteredAccommodations = accommodations
    .filter(a => 
      (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      a.price >= priceRange[0] && a.price <= priceRange[1]
    )
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.distanceFromUniversity - b.distanceFromUniversity)

  return (
    <div className="container mx-auto mt-8 p-4 space-y-8">
      <h2 className="text-3xl font-bold">Find Accommodation</h2>
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-grow">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search accommodations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="sort">Sort by</Label>
              <Select onValueChange={(value) => setSortBy(value as 'price' | 'distance')}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={20000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <AccommodationList accommodations={filteredAccommodations} />
    </div>
  )
}

export default UserDashboard;