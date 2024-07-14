package com.mymovielist.movieapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import com.mymovielist.movieapp.repository.UserRepository;
import com.mymovielist.movieapp.model.User;

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
                user.getMovieIds().add(movieId);
                return userRepository.save(user);
            });
    }

    public List<String> getUserMovieIds(String username) {
        return userRepository.findByUsername(username)
            .map(User::getMovieIds)
            .orElse(List.of());
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
                user.getMovieIds().removeIf(id -> id.startsWith(movieId));
                return userRepository.save(user);
            });
    }
}