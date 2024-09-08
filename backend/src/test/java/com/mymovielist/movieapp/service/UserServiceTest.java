package com.mymovielist.movieapp.service;

import com.mymovielist.movieapp.model.MovieEntry;
import com.mymovielist.movieapp.model.User;
import com.mymovielist.movieapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = userService.createUser(user);

        assertNotNull(createdUser);
        assertEquals("testuser", createdUser.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testAddMovieToUser() {
        String username = "testuser";
        String movieId = "123";
        User user = new User();
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        Optional<User> updatedUser = userService.addMovieToUser(username, movieId);

        assertTrue(updatedUser.isPresent());
        assertEquals(1, updatedUser.get().getMovieEntries().size());
        assertEquals("123", updatedUser.get().getMovieEntries().get(0).getMovieId());
        verify(userRepository, times(1)).findByUsername(username);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testGetUserMovies() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        user.addMovieEntry(new MovieEntry("123", "Watched", 8.5));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        List<MovieEntry> movieEntries = userService.getUserMovies(username);

        assertNotNull(movieEntries);
        assertEquals(1, movieEntries.size());
        assertEquals("123", movieEntries.get(0).getMovieId());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testAuthenticateUser_Success() {
        String username = "testuser";
        String password = "password";
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User authenticatedUser = userService.authenticateUser(username, password);

        assertNotNull(authenticatedUser);
        assertEquals("testuser", authenticatedUser.getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testAuthenticateUser_Failure() {
        String username = "testuser";
        String password = "wrongpassword";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        User authenticatedUser = userService.authenticateUser(username, password);

        assertNull(authenticatedUser);
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testDeleteUser() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        userService.deleteUser(username);

        verify(userRepository, times(1)).findByUsername(username);
        verify(userRepository, times(1)).delete(user);
    }
}
