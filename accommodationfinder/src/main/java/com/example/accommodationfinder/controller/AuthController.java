package com.example.accommodationfinder.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.accommodationfinder.model.User;
import com.example.accommodationfinder.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.get("username"), loginRequest.get("password"));
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during authentication");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println("Received signup request for user: " + user.getUsername());
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                System.out.println("Username is already taken: " + user.getUsername());
                return ResponseEntity.badRequest().body("Username is already taken!");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                System.out.println("Email is already in use: " + user.getEmail());
                return ResponseEntity.badRequest().body("Email is already in use!");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User result = userRepository.save(user);
            System.out.println("User registered successfully: " + result.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            System.out.println("Error during user registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during user registration");
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println("Received signup request for user: " + user.getUsername());
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                System.out.println("Username is already taken: " + user.getUsername());
                return ResponseEntity.badRequest().body("Username is already taken!");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                System.out.println("Email is already in use: " + user.getEmail());
                return ResponseEntity.badRequest().body("Email is already in use!");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User result = userRepository.save(user);
            System.out.println("User registered successfully: " + result.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            System.out.println("Error during user registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during user registration");
        }
    }