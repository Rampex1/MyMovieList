import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/Modal/UserContext';
import backgroundImage from '../assets/background.jpg';
import FeaturedMovie from '../components/FeaturedMovie/FeaturedMovie';
import { useNavigate } from 'react-router-dom';

interface MovieSuggestion {
  id: number;
  title: string;
  release_date: string;
}

const Home: React.FC = () => {
  const [movieName, setMovieName] = useState('');
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const { isLoggedIn } = useUser();
  const searchRef = useRef<HTMLDivElement>(null);
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  const clearSearch = () => {
    setMovieName('');
    setSuggestions([]);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMovieName(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/search?query=${encodeURIComponent(value)}`);
        setSuggestions(response.data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchMoviePoster = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/movies/316029`);
      const movieData = response.data;
      setPosterPath(movieData.backdrop_path);
    } catch (error) {
      console.error('Error fetching movie poster:', error);
    }
  };

  const scrollToFeaturedMovie = () => {
    const featuredMovieSection = document.getElementById('featured-movie-section');
    if (featuredMovieSection) {
      featuredMovieSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchMoviePoster();
  }, []);

  return (
    <div>
      <div 
        className="flex flex-col items-center justify-center w-full h-screen p-4 bg-cover bg-center space-y-12"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="text-center space-y-6">
          <h1 className="text-white text-6xl font-extrabold font-inter">MyMovieList</h1>
          <p className="text-white text-3xl font-inter">Your Ultimate Movie Diary</p>
        </div>

        <div className="w-full max-w-2xl relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={movieName}
              onChange={handleInputChange}
              placeholder="Start Searching for a Movie"
              className="w-full p-4 pr-12 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={clearSearch}
              className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &#x2715;
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
              {suggestions.map((movie) => (
                <li 
                  key={movie.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSearch(movie.id.toString())}
                >
                  {movie.title} ({movie.release_date.split('-')[0]})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToFeaturedMovie}
          className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      <div id="featured-movie-section">
        <FeaturedMovie />
      </div>
    </div>
  );
};

export default Home;