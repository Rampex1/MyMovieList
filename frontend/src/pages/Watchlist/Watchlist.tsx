import React, { useState, useEffect } from 'react';
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

const Watchlist: React.FC = () => {
    const [movieId, setMovieId] = useState('');
    const [currentlyWatching, setCurrentlyWatching] = useState<Movie[]>([]);
    const { isLoggedIn, username } = useUser();

    useEffect(() => {
        if (isLoggedIn && username) {
          fetchUserMovies();
        }
      }, [isLoggedIn, username]);

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
          type: 'Drama', // You might want to get this from genres
          score: movieData.vote_average,
          progress: 'Watching'
        };
    };

    const handleSearch = async () => {
        if (!isLoggedIn) {
          alert('Please log in to add movies to your watchlist.');
          return;
        }
        try {
          const movieDetails = await fetchMovieDetails(movieId);
          await axios.post(`http://localhost:8080/api/users/${username}/movies`, movieId);
          setCurrentlyWatching(prevState => [...prevState, movieDetails]);
          setMovieId('');
        } catch (error) {
          console.error('Error adding movie:', error);
        }
    };

    const handleDelete = async (movieId: string) => {
        if (!isLoggedIn) {
          alert('Please log in to remove movies from your watchlist.');
          return;
        }
        try {
          await axios.delete(`http://localhost:8080/api/users/${username}/movies/${movieId}`);
          setCurrentlyWatching(prevState => prevState.filter(movie => movie.id !== parseInt(movieId)));
        } catch (error) {
          console.error('Error removing movie:', error);
        }
    };

    return (
        <div className="flex flex-col items-start w-full p-4">
            <h1 className="text-3xl font-bold mb-6 ml-[10%]">Welcome {username}!</h1>
            
            <div className="w-4/5 mx-auto mb-6 flex">
                <input
                    type="text"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    placeholder="Enter movie ID"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    onClick={handleSearch}
                    className="bg-[#0D99FF] text-white p-2 rounded-r-md"
                >
                    Confirm
                </button>
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