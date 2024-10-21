package com.example.accommodationfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.accommodationfinder.model.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
}
