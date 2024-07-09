package com.mymovielist.movieapp.controller;

import com.mymovielist.movieapp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/{movieId}")
    public ResponseEntity<String> getMovieDetails(@PathVariable String movieId) {
        String movieDetails = movieService.getMovieDetails(movieId);
        return ResponseEntity.ok(movieDetails);
    }
}