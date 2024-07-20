import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../components/Modal/UserContext';
import AddMovieModal from '../components/Modal/AddMovieModal';
import { Movie } from '../pages/Watchlist';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (movieId: string) => {
    if (!isLoggedIn) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
      const movieData = response.data;
      setSelectedMovie({
        id: movieData.id,
        title: movieData.original_title,
        country: movieData.production_countries[0]?.iso_3166_1 || 'Unknown',
        year: new Date(movieData.release_date).getFullYear(),
        type: movieData.genres[0]?.name || 'Unknown',
        score: 0,
        status: ''
      });
      setIsModalOpen(true);
      setSuggestions([]); // Clear suggestions
      setMovieName(''); // Optionally clear the search input
    } catch (error) {
      console.error('Error fetching movie details:', error);
      alert('Error fetching movie details. Please try again.');
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

  const handleAddOrUpdateMovie = async (status: string, score: number) => {
    if (!selectedMovie) return;
    try {
      await axios.post(
        `http://localhost:8080/api/users/${username}/movies`,
        { 
          movieId: selectedMovie.id.toString(),
          status,
          score
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      await axios.put(`http://localhost:8080/api/users/${username}/movies/${selectedMovie.id}`, {
        status,
        score
      });
      alert('Movie added to your watchlist!');
      setIsModalOpen(false);
      setSelectedMovie(null);
      setMovieName('');
      setSuggestions([]);
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error adding movie. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!selectedMovie) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${username}/movies/${selectedMovie.id}`);
      alert('Movie removed from your watchlist.');
      setIsModalOpen(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error removing movie:', error);
      alert('Error removing movie. Please try again.');
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
      {isModalOpen && (
      <AddMovieModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMovie(null);
        }}
        onSubmit={handleAddOrUpdateMovie}
        onDelete={handleDelete}
        movie={selectedMovie}
      />
    )}
    </div>
  );
};

export default Search;