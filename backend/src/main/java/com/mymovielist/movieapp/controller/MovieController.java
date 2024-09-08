package com.mymovielist.movieapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymovielist.movieapp.model.Movie;
import com.mymovielist.movieapp.service.MovieService;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

}
