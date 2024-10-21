package com.example.accommodationfinder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.accommodationfinder.model.Accommodation;
import com.example.accommodationfinder.service.AccommodationService;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {
    @Autowired
    private AccommodationService accommodationService;

    @GetMapping
    public List<Accommodation> getAllAccommodations() {
        return accommodationService.getAllAccommodations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accommodation> getAccommodationById(@PathVariable Long id) {
        Accommodation accommodation = accommodationService.getAccommodationById(id);
        return ResponseEntity.ok(accommodation);
    }

    @GetMapping("/broker/{brokerId}")
    public List<Accommodation> getAccommodationsByBrokerId(@PathVariable Long brokerId) {
        return accommodationService.getAccommodationsByBrokerId(brokerId);
    }

    @PostMapping
    @PreAuthorize("hasRole('BROKER')")
    public ResponseEntity<Accommodation> createAccommodation(@RequestBody Accommodation accommodation) {
        Accommodation newAccommodation = accommodationService.createAccommodation(accommodation);
        return ResponseEntity.ok(newAccommodation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BROKER')")
    public ResponseEntity<Accommodation> updateAccommodation(@PathVariable Long id, @RequestBody Accommodation accommodationDetails) {
        Accommodation updatedAccommodation = accommodationService.updateAccommodation(id, accommodationDetails);
        return ResponseEntity.ok(updatedAccommodation);
    }
}
