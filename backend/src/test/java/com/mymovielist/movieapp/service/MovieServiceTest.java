package com.mymovielist.movieapp.service;

import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;

public class MovieServiceTest {

    @Mock
    private OkHttpClient mockHttpClient;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        movieService = new MovieService(mockHttpClient);
    }

    @Test
    public void testGetMovieDetails_Success() throws IOException {
        // Given
        String movieId = "12345";
        String expectedResponse = "{ \"title\": \"Inception\", \"id\": 27205 }";

        Response mockResponse = new Response.Builder()
                .code(200)
                .message("OK")
                .protocol(Protocol.HTTP_1_1)
                .request(new Request.Builder().url("https://api.themoviedb.org/3/movie/" + movieId).build())
                .body(ResponseBody.create(expectedResponse, MediaType.get("application/json")))
                .build();

        Call mockCall = mock(Call.class);
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);

        // When
        String actualResponse = movieService.getMovieDetails(movieId);

        // Then
        assertEquals(expectedResponse, actualResponse);
        verify(mockHttpClient, times(1)).newCall(any(Request.class));
    }

    @Test
    public void testGetMovieDetails_Failure() throws IOException {
        // Given
        String movieId = "12345";

        Call mockCall = mock(Call.class);
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenThrow(new IOException("Failed to connect to API"));

        // When and Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            movieService.getMovieDetails(movieId);
        });
        assertEquals("Failed to fetch movie details", exception.getMessage());
        verify(mockHttpClient, times(1)).newCall(any(Request.class));
    }

    @Test
    public void testGetTrendingMovies_Success() throws IOException {
        // Given
        String expectedResponse = "{ \"results\": [{ \"title\": \"Inception\" }] }";

        Response mockResponse = new Response.Builder()
                .code(200)
                .message("OK")
                .protocol(Protocol.HTTP_1_1)
                .request(new Request.Builder().url("https://api.themoviedb.org/3/trending/movie/week").build())
                .body(ResponseBody.create(expectedResponse, MediaType.get("application/json")))
                .build();

        Call mockCall = mock(Call.class);
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);

        // When
        String actualResponse = movieService.getTrendingMovies();

        // Then
        assertEquals(expectedResponse, actualResponse);
        verify(mockHttpClient, times(1)).newCall(any(Request.class));
    }

    @Test
    public void testGetTrendingMovies_Failure() throws IOException {
        // Given
        Call mockCall = mock(Call.class);
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenThrow(new IOException("Failed to connect to API"));

        // When and Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            movieService.getTrendingMovies();
        });
        assertEquals("Failed to fetch trending movies", exception.getMessage());
        verify(mockHttpClient, times(1)).newCall(any(Request.class));
    }
}
