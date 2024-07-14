import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../../components/Modal/UserContext';

interface Movie {
  id: number;
  title: string;
  country: string;
  year: number;
  type: string;
  score: number;
  progress: string;
}

interface MovieSuggestion {
    id: number;
    title: string;
    release_date: string;
}

const Watchlist: React.FC = () => {
    const [movieName, setMovieName] = useState('');
    const [currentlyWatching, setCurrentlyWatching] = useState<Movie[]>([]);
    const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([])
    const { isLoggedIn, username } = useUser();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoggedIn && username) {
          fetchUserMovies();
        }
    }, [isLoggedIn, username]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchUserMovies = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${username}/movies`);
          const movieIds = response.data;
          const movieDetails = await Promise.all(movieIds.map(fetchMovieDetails));
          setCurrentlyWatching(movieDetails);
        } catch (error) {
          console.error('Error fetching user movies:', error);
        }
    };

    const fetchMovieDetails = async (movieId: string) => {
        const response = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
        const movieData = response.data;
        return {
          id: movieData.id,
          title: movieData.original_title,
          country: movieData.production_countries[0]?.iso_3166_1 || 'Unknown',
          year: new Date(movieData.release_date).getFullYear(),
          type: movieData.genres[0]?.name || 'Unknown',
          score: movieData.vote_average,
          progress: 'Watching'
        };
    };

    const handleSearch = async (movieId: string) => {
        if (!isLoggedIn) {
          alert('Please log in to add movies to your watchlist.');
          return;
        }
        try {
          const response = await axios.post(`http://localhost:8080/api/users/${username}/movies`, movieId);
          if (response.data.added) {
            fetchUserMovies(); // Refresh the entire list from the backend
          } 
          setMovieName('');
          setSuggestions([]);
        } catch (error) {
          console.error('Error adding movie:', error);
          alert('Error adding movie. Please try again.');
        }
    };

    const handleDelete = async (movieId: string) => {
        if (!isLoggedIn) {
          alert('Please log in to remove movies from your watchlist.');
          return;
        }
        try {
          await axios.delete(`http://localhost:8080/api/users/${username}/movies/${movieId}`);
          fetchUserMovies(); // Refresh the entire list from the backend
        } catch (error) {
          console.error('Error removing movie:', error);
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
        <div className="flex flex-col items-start w-full p-4">
            <h1 className="text-3xl font-bold mb-6 ml-[10%]">Welcome {username}!</h1>
            
            <div className="w-4/5 mx-auto mb-6 flex relative" ref={searchRef}>
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

            <table className="w-4/5 border-collapse bg-white border border-[#E3E3E3] mx-auto mb-12">
                <thead>
                    <tr>
                        <th colSpan={7} className="bg-white text-black font-inter p-2 text-left" style={{ fontSize: '16px' }}>
                            Currently Watching
                        </th>
                    </tr>
                    <tr className="bg-[#0D99FF]">
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>#</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Title</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Country</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Year</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Type</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Score</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Progress</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {currentlyWatching.map((movie, index) => (
                        <tr key={movie.id} className={index % 2 === 0 ? "bg-[#BDE3FF]" : "bg-white"}>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.id}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.title}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.country}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.year}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.type}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.score}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.progress}</td>
                            <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>
                                <button
                                    onClick={() => handleDelete(movie.id.toString())}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Completed table remains unchanged */}
        </div>
    );
};

export default Watchlist;