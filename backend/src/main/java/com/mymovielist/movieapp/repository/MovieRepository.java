package com.mymovielist.movieapp.repository;

import com.mymovielist.movieapp.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, String> {
}
