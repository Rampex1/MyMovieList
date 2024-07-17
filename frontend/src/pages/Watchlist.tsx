import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../components/Modal/UserContext';
import AddMovieModal from '../components/Modal/AddMovieModal';

interface Movie {
    id: number;
    title: string;
    country: string;
    year: number;
    type: string;
    score: number;
    status: string;
  }
  
  interface MovieSuggestion {
    id: number;
    title: string;
    release_date: string;
  }

const Watchlist: React.FC = () => {
    const [movieName, setMovieName] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
    const { isLoggedIn, username } = useUser();
    const searchRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [activeFilter, setActiveFilter] = useState('All Movies');
  
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
          const movieEntries = response.data;
          const movieDetails = await Promise.all(movieEntries.map(fetchMovieDetails));
          setMovies(movieDetails);
        } catch (error) {
          console.error('Error fetching user movies:', error);
        }
      };
    
      const fetchMovieDetails = async (movieEntry: any) => {
        const response = await axios.get(`http://localhost:8080/api/movies/${movieEntry.movieId}`);
        const movieData = response.data;
        return {
          id: movieData.id,
          title: movieData.original_title,
          country: movieData.production_countries[0]?.iso_3166_1 || 'Unknown',
          year: new Date(movieData.release_date).getFullYear(),
          type: movieData.genres[0]?.name || 'Unknown',
          score: movieEntry.score,
          status: movieEntry.status
        };
      };

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
            fetchUserMovies();
            // Open modal for setting status and score
            const newMovie = await fetchMovieDetails({ movieId: movieId.toString() });
            setSelectedMovie(newMovie);
            setIsModalOpen(true);
          }
          setMovieName('');
          setSuggestions([]);
        } catch (error) {
          console.error('Error adding movie:', error);
          alert('Error adding movie. Please try again.');
        }
      };

      const filterButtons = [
        'All Movies',
        'Currently Watching',
        'Completed',
        'Plan To Watch',
        'On-hold',
        'Dropped'
      ];

      const renderFilterButtons = () => (
        <div className="flex justify-center mb-6">
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`mx-2 px-4 py-2 rounded ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      );

      const handleAddOrUpdateMovie = async (status: string, score: number) => {
        if (!selectedMovie) return;
        try {
          await axios.put(`http://localhost:8080/api/users/${username}/movies/${selectedMovie.id}`, {
            status,
            score
          });
          fetchUserMovies();
          setIsModalOpen(false);
          setSelectedMovie(null);
        } catch (error) {
          console.error('Error updating movie:', error);
          alert('Error updating movie. Please try again.');
        }
      };
      
      const handleDelete = async (movieId: string) => {
        if (!isLoggedIn) {
          alert('Please log in to remove movies from your watchlist.');
          return;
        }
        try {
          await axios.delete(`http://localhost:8080/api/users/${username}/movies/${movieId}`);
          fetchUserMovies();
          setIsModalOpen(false);
          setSelectedMovie(null);
        } catch (error) {
          console.error('Error removing movie:', error);
          alert('Error removing movie. Please try again.');
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

    const handleEditMovie = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
      };

    const renderTables = () => {
      if (activeFilter === 'All Movies') {
        return (
          <>
            {renderMovieTable('Currently Watching')}
            {renderMovieTable('Completed')}
            {renderMovieTable('Plan To Watch')}
            {renderMovieTable('On-hold')}
            {renderMovieTable('Dropped')}
          </>
        );
      } else {
        return renderMovieTable(activeFilter);
      }
    };

    const renderMovieTable = (status: string) => {
        const filteredMovies = movies.filter(movie => movie.status === status);
        return (
          <table className="w-4/5 border-collapse bg-white border border-[#E3E3E3] mx-auto mb-12">
            <thead>
              <tr>
                <th colSpan={8} className="bg-white text-black font-inter p-2 text-left" style={{ fontSize: '16px' }}>
                  {status}
                </th>
              </tr>
              <tr className="bg-[#0D99FF]">
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>#</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Title</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Country</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Year</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Type</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Score</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Status</th>
                <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie, index) => (
                <tr key={movie.id} className={index % 2 === 0 ? "bg-[#BDE3FF]" : "bg-white"}>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.id}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.title}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.country}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.year}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.type}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.score}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>{movie.status}</td>
                    <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>
                    <button
                    onClick={() => handleEditMovie(movie)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                    >
                    Edit
                    </button>
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
        );
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
            {renderFilterButtons()}
            {renderTables()}

            {isModalOpen && (
              <AddMovieModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedMovie(null);
                }}
                onSubmit={handleAddOrUpdateMovie}
                movie={selectedMovie}
              />
            )}
        </div>
    );
};

export default Watchlist;