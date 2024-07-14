package com.mymovielist.movieapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<User> addMovieToUser(@PathVariable String username, @RequestBody String movieId) {
        return userService.addMovieToUser(username, movieId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
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
}
