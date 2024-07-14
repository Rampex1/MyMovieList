package com.mymovielist.movieapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mymovielist.movieapp.model.LoginRequest;
import com.mymovielist.movieapp.model.User;
import com.mymovielist.movieapp.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/{username}/movies")
    public ResponseEntity<?> addMovieToUser(@PathVariable String username, @RequestBody String movieId) {
        try {
            return userService.addMovieToUser(username, movieId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error adding movie: " + e.getMessage()));
        }
    }

    @GetMapping("/{username}/movies")
    public ResponseEntity<List<String>> getUserMovieIds(@PathVariable String username) {
        List<String> movieIds = userService.getUserMovieIds(username);
        return ResponseEntity.ok(movieIds);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllUsers() {
        userService.deleteAllUsers();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("success", true, "username", user.getUsername()));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }
    @DeleteMapping("/{username}/movies/{movieId}")
    public ResponseEntity<User> removeMovieFromUser(@PathVariable String username, @PathVariable String movieId) {
        System.out.println("Attempting to remove movie " + movieId + " from user " + username);
        return userService.removeMovieFromUser(username, movieId)
            .map(user -> {
                System.out.println("Movie removed successfully. Updated user: " + user);
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
