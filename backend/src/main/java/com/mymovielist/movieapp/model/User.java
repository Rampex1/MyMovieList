package com.mymovielist.movieapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    @Indexed(unique = true)
    private String username;
    private String password;
    private List<MovieEntry> movieEntries;

    public User() {
        this.movieEntries = new ArrayList<>();
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<MovieEntry> getMovieEntries() {
        return movieEntries;
    }

    public void setMovieEntries(List<MovieEntry> movieEntries) {
        this.movieEntries = movieEntries;
    }

    public void addMovieEntry(MovieEntry movieEntry) {
        if (this.movieEntries == null) {
            this.movieEntries = new ArrayList<>();
        }
        this.movieEntries.add(movieEntry);
    }
}

