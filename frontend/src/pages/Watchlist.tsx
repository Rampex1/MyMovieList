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
    const [movies, setMovies] = useState<Movie[]>([]);
    const { isLoggedIn, username } = useUser();
    const searchRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
    useEffect(() => {
      if (isLoggedIn && username) {
        fetchUserMovies();
      }
    }, [isLoggedIn, username]);

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

    const handleEditMovie = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
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

            {renderMovieTable('Currently Watching')}
            {renderMovieTable('Completed')}
            {renderMovieTable('Plan To Watch')}
            {renderMovieTable('On-hold')}
            {renderMovieTable('Dropped')}

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