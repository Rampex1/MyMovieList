package com.mymovielist.movieapp.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class MovieService {

    private final OkHttpClient client;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.themoviedb.org/3/movie/";

    @Autowired
    public MovieService(OkHttpClient client) {
        this.client = client;
    }

    public String getMovieDetails(String movieId) {
        Request request = new Request.Builder()
                .url(BASE_URL + movieId + "?api_key=" + apiKey + "&language=en-US")
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            throw new RuntimeException("Failed to fetch movie details", e);
        }
    }
}
