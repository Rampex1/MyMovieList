package com.mymovielist.movieapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymovielist.movieapp.model.User;
import com.mymovielist.movieapp.model.MovieEntry;
import com.mymovielist.movieapp.model.LoginRequest;
import com.mymovielist.movieapp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        when(userService.createUser(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    public void testAddMovieToUser() throws Exception {
        String username = "testuser";
        String movieId = "123";
        User user = new User();
        user.setUsername(username);

        when(userService.addMovieToUser(eq(username), eq(movieId))).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/users/{username}/movies", username)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\": \"123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Movie added successfully"));

        verify(userService, times(1)).addMovieToUser(username, movieId);
    }

    @Test
    public void testGetUserMovies() throws Exception {
        String username = "testuser";
        MovieEntry movieEntry = new MovieEntry("123", "Watched", 8.5);
        when(userService.getUserMovies(eq(username))).thenReturn(List.of(movieEntry));

        mockMvc.perform(get("/api/users/{username}/movies", username)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].movieId").value("123"));

        verify(userService, times(1)).getUserMovies(username);
    }

    @Test
    public void testDeleteUser() throws Exception {
        String username = "testuser";

        mockMvc.perform(delete("/api/users/{username}", username))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(username);
    }
}
