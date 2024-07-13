package com.mymovielist.movieapp.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.mymovielist.movieapp.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
}
