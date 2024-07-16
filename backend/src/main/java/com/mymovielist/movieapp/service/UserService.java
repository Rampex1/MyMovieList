package com.mymovielist.movieapp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mymovielist.movieapp.repository.UserRepository;
import com.mymovielist.movieapp.model.User;
import com.mymovielist.movieapp.model.MovieEntry;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> addMovieToUser(String username, String movieId) {
        return userRepository.findByUsername(username)
            .map(user -> {
                if (user.getMovieEntries().stream().noneMatch(entry -> entry.getMovieId().equals(movieId))) {
                    MovieEntry newEntry = new MovieEntry(movieId, "Plan To Watch", 0.0); // Default values
                    user.addMovieEntry(newEntry);
                    return userRepository.save(user);
                }
                return user;
            });
    }

    public List<MovieEntry> getUserMovies(String username) {
        return userRepository.findByUsername(username)
            .map(User::getMovieEntries)
            .orElse(List.of());
    }

    public Optional<User> updateUserMovie(String username, String movieId, String status, Double score) {
        return userRepository.findByUsername(username)
            .map(user -> {
                user.getMovieEntries().stream()
                    .filter(entry -> entry.getMovieId().equals(movieId))
                    .findFirst()
                    .ifPresent(entry -> {
                        entry.setStatus(status);
                        entry.setScore(score);
                    });
                return userRepository.save(user);
            });
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String username) {
        userRepository.findByUsername(username)
            .ifPresent(userRepository::delete);
    }

    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    public User authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }

    public Optional<User> removeMovieFromUser(String username, String movieId) {
        return userRepository.findByUsername(username)
            .map(user -> {
                user.setMovieEntries(user.getMovieEntries().stream()
                    .filter(entry -> !entry.getMovieId().equals(movieId))
                    .collect(Collectors.toList()));
                return userRepository.save(user);
            });
    }
}