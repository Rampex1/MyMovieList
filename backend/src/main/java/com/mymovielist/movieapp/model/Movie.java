package com.mymovielist.movieapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movies")
public class Movie {
    @Id
    private String id;
    private String title;
    private String overview;
    // Add other fields as needed

    // Getters and setters
}