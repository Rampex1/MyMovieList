package com.mymovielist.movieapp.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymovielist.movieapp.model.LoginRequest;
import com.mymovielist.movieapp.model.User;
import com.mymovielist.movieapp.model.MovieEntry;
import com.mymovielist.movieapp.service.UserService;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

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
    public ResponseEntity<?> addMovieToUser(@PathVariable String username, @RequestBody Map<String, String> payload) {
        String movieId = payload.get("movieId");
        try {
            Optional<User> updatedUser = userService.addMovieToUser(username, movieId);
            return updatedUser
                .map(user -> ResponseEntity.ok().body(Map.of("message", "Movie added successfully", "added", true)))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error adding movie: " + e.getMessage()));
        }
    }

    @GetMapping("/{username}/movies")
    public ResponseEntity<List<MovieEntry>> getUserMovies(@PathVariable String username) {
        List<MovieEntry> movieEntries = userService.getUserMovies(username);
        return ResponseEntity.ok(movieEntries);
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
    public ResponseEntity<?> removeMovieFromUser(@PathVariable String username, @PathVariable String movieId) {
        Optional<User> updatedUser = userService.removeMovieFromUser(username, movieId);
        return updatedUser
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{username}/movies/{movieId}")
    public ResponseEntity<?> updateUserMovie(
        @PathVariable String username,
        @PathVariable String movieId,
        @RequestBody Map<String, Object> updates
    ) {
        try {
            String status = (String) updates.get("status");
            Double score = ((Number) updates.get("score")).doubleValue();
            Optional<User> updatedUser = userService.updateUserMovie(username, movieId, status, score);
            return updatedUser
                .map(user -> ResponseEntity.ok().body(Map.of("message", "Movie updated successfully")))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error updating movie: " + e.getMessage()));
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<Map<String, Object>> getTrendingMovies() {
        String apiKey = "e43f973af82ec44359fdd966c0401d8f";
        String url = String.format("https://api.themoviedb.org/3/trending/movie/week?api_key=%s", apiKey);

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
            .url(url)
            .build();

        try {
            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            String jsonData = response.body().string();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map = mapper.readValue(jsonData, Map.class);
            return ResponseEntity.ok(map);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching trending movies: " + e.getMessage()));
        }
    }
}
