package com.mymovielist.movieapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymovielist.movieapp.service.MovieService;
import okhttp3.OkHttpClient;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class MovieControllerTest {

    @Mock
    private MovieService movieService;

    @Mock
    private OkHttpClient okHttpClient;

    @Mock
    private Response response;

    @Mock
    private ResponseBody responseBody;

    @InjectMocks
    private MovieController movieController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchMovies() throws IOException {
        // Arrange
        String query = "Inception";
        String jsonResponse = "{\"results\": [{\"id\": 1, \"title\": \"Inception\"}]}";
        
        when(okHttpClient.newCall(any())).thenReturn(mock(okhttp3.Call.class));
        when(okHttpClient.newCall(any()).execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(jsonResponse);

        // Act
        ResponseEntity<Map<String, Object>> result = movieController.searchMovies(query);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody().containsKey("results"));
    }

    @Test
    void testGetMovieDetails() throws IOException {
        // Arrange
        String movieId = "550";
        String jsonResponse = "{\"id\": 550, \"title\": \"Fight Club\"}";
        
        when(okHttpClient.newCall(any())).thenReturn(mock(okhttp3.Call.class));
        when(okHttpClient.newCall(any()).execute()).thenReturn(response);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(jsonResponse);

        // Act
        ResponseEntity<Map<String, Object>> result = movieController.getMovieDetails(movieId);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(550, result.getBody().get("id"));
        assertEquals("Fight Club", result.getBody().get("title"));
    }

    @Test
    void testGetTrendingMovies() throws IOException {
        // Arrange
        String jsonResponse = "{\"results\": [{\"id\": 1, \"title\": \"Trending Movie\"}]}";
        
        when(okHttpClient.newCall(any())).thenReturn(mock(okhttp3.Call.class));
        when(okHttpClient.newCall(any()).execute()).thenReturn(response);
        when(response.isSuccessful()).thenReturn(true);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(jsonResponse);

        // Act
        ResponseEntity<Map<String, Object>> result = movieController.getTrendingMovies();

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody().containsKey("results"));
    }

    @Test
    void testGetMovieVideos() throws IOException {
        // Arrange
        String movieId = "550";
        String jsonResponse = "{\"id\": 550, \"results\": [{\"key\": \"video_key\", \"site\": \"YouTube\"}]}";
        
        when(okHttpClient.newCall(any())).thenReturn(mock(okhttp3.Call.class));
        when(okHttpClient.newCall(any()).execute()).thenReturn(response);
        when(response.body()).thenReturn(responseBody);
        when(responseBody.string()).thenReturn(jsonResponse);

        // Act
        ResponseEntity<Map<String, Object>> result = movieController.getMovieVideos(movieId);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(550, result.getBody().get("id"));
        assertTrue(result.getBody().containsKey("results"));
    }
}