package com.mymovielist.movieapp.model;

public class MovieEntry {
    private String movieId;
    private String status;
    private Double score;

    // Constructor
    public MovieEntry(String movieId, String status, Double score) {
        this.movieId = movieId;
        this.status = status;
        this.score = score;
    }

    // Getters
    public String getMovieId() {
        return movieId;
    }

    public String getStatus() {
        return status;
    }

    public Double getScore() {
        return score;
    }

    // Setters
    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
