package com.example.accommodationfinder.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.accommodationfinder.model.Accommodation;
import com.example.accommodationfinder.repository.AccommodationRepository;

@Service
public class AccommodationService {
    @Autowired
    private AccommodationRepository accommodationRepository;

    public List<Accommodation> getAllAccommodations() {
        return accommodationRepository.findAll();
    }

    public Accommodation getAccommodationById(Long id) {
        return accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found"));
    }

    public List<Accommodation> getAccommodationsByBrokerId(Long brokerId) {
        return accommodationRepository.findByBrokerId(brokerId);
    }

    public Accommodation createAccommodation(Accommodation accommodation) {
        return accommodationRepository.save(accommodation);
    }

    public Accommodation updateAccommodation(Long id, Accommodation accommodationDetails) {
        Accommodation accommodation = getAccommodationById(id);
        accommodation.setTitle(accommodationDetails.getTitle());
        accommodation.setAddress(accommodationDetails.getAddress());
        accommodation.setPrice(accommodationDetails.getPrice());
        accommodation.setDistanceFromUniversity(accommodationDetails.getDistanceFromUniversity());
        accommodation.setContactEmail(accommodationDetails.getContactEmail());
        accommodation.setContactPhone(accommodationDetails.getContactPhone());
        accommodation.setAmenities(accommodationDetails.getAmenities());
        return accommodationRepository.save(accommodation);
    }

    public void deleteAccommodation(Long id) {
        accommodationRepository.deleteById(id);
    }
}