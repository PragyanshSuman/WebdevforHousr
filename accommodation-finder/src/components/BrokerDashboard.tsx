import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { createAccommodation, getAccommodationsByBrokerId } from '../services/api';
import { useAuth } from '../useAuth';
import { toast } from 'react-toastify';

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

const AccommodationUploadForm: React.FC<{ onUpload: (accommodation: Omit<Accommodation, 'id' | 'brokerId'>) => void }> = ({ onUpload }) => {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [distanceFromUniversity, setDistanceFromUniversity] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpload({
      title,
      address,
      price: Number(price),
      distanceFromUniversity: Number(distanceFromUniversity),
      amenities,
      photos: ["/placeholder.svg?height=200&width=300"], // Replace with actual photo upload logic
      contactEmail,
      contactPhone
    })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter(a => a !== amenity))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">Price (₹/month)</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="distance">Distance from SRM (km)</Label>
        <Input id="distance" type="number" value={distanceFromUniversity} onChange={(e) => setDistanceFromUniversity(e.target.value)} required />
      </div>
      <div>
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-4 mt-2">
          {['Wi-Fi', 'AC', 'Furnished', 'Parking'].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Contact Email</Label>
        <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phone">Contact Phone</Label>
        <Input id="phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">Upload Accommodation</Button>
    </form>
  )
}

const BrokerDashboard: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const { user } = useAuth();

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (user) {
        try {
          const response = await getAccommodationsByBrokerId(user.id);
          setAccommodations(response.data);
        } catch (error) {
          console.error('Error fetching accommodations:', error);
          toast.error('Failed to fetch accommodations');
        }
      }
    };
    fetchAccommodations();
  }, [user])

  const handleUpload = async (newAccommodation: Omit<Accommodation, 'id' | 'brokerId'>) => {
    if (user) {
      try {
        const response = await createAccommodation({ ...newAccommodation, brokerId: user.id });
        setAccommodations([...accommodations, response.data]);
        toast.success('Accommodation uploaded successfully');
      } catch (error) {
        console.error('Error creating accommodation:', error);
        toast.error('Failed to upload accommodation');
      }
    }
  }

  return (
    <div className="container mx-auto mt-8 p-4 space-y-8">
      <h2 className="text-3xl font-bold">Broker Dashboard</h2>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Accommodation</CardTitle>
        </CardHeader>
        <CardContent>
          <AccommodationUploadForm onUpload={handleUpload} />
        </CardContent>
      </Card>
      <h3 className="text-2xl font-bold mt-8">Your Accommodations</h3>
      {accommodations.length === 0 ? (
        <p>You haven't uploaded any accommodations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.id}>
              <CardHeader>
                <CardTitle>{accommodation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{accommodation.address}</p>
                <p>₹{accommodation.price}/month</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrokerDashboard;