package com.example.accommodationfinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.accommodationfinder.model.Accommodation;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByBrokerId(Long brokerId);
}
