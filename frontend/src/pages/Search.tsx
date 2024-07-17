import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../components/Modal/UserContext';

interface MovieSuggestion {
  id: number;
  title: string;
  release_date: string;
}

const Search: React.FC = () => {
  const [movieName, setMovieName] = useState('');
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const { isLoggedIn, username } = useUser();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (movieId: string) => {
    if (!isLoggedIn) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${username}/movies`,
        { movieId: movieId.toString() },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.added) {
        alert('Movie added to your watchlist!');
      } else {
        alert('Movie is already in your watchlist.');
      }
      setMovieName('');
      setSuggestions([]);
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error adding movie. Please try again.');
    }
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

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>
      <div className="w-4/5 mb-6 flex relative" ref={searchRef}>
        <input
          type="text"
          value={movieName}
          onChange={handleInputChange}
          placeholder="Enter movie name"
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
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
  );
};

export default Search;