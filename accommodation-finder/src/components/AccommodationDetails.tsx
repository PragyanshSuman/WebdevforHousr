import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { MapPin, DollarSign, Wifi, Coffee, Car } from 'lucide-react'
import { getAccommodationById } from '../services/api';

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

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await getAccommodationById(Number(id));
        setAccommodation(response.data);
      } catch (error) {
        console.error('Error fetching accommodation details:', error);
      }
    };
    fetchAccommodation();
  }, [id])

  if (!accommodation) {
    return <div className="container mx-auto mt-8 p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>{accommodation.title}</CardTitle>
          <CardDescription className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {accommodation.address}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <img src={accommodation.photos[0]} alt={accommodation.title} className="w-full h-64 object-cover rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Price</h3>
              <p className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                ₹{accommodation.price}/month
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Distance from SRM</h3>
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {accommodation.distanceFromUniversity} km
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Amenities</h3>
              <div className="flex flex-wrap gap-2 mt-2">
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
            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <p>Email: {accommodation.contactEmail}</p>
              <p>Phone: {accommodation.contactPhone}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Contact Owner</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AccommodationDetails;