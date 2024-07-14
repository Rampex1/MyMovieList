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
    const [movieName, setMovieName] = useState('');
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
          type: movieData.genres[0]?.name || 'Unknown',
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
          console.log(`Searching for movie: ${movieName}`);
          const searchResponse = await axios.get(`http://localhost:8080/api/movies/search?query=${encodeURIComponent(movieName)}`);
          console.log('Search response:', searchResponse.data);
          
          const searchResults = searchResponse.data.results;
          
          if (searchResults.length === 0) {
            alert('No movies found with that name.');
            return;
          }
    
          const movieId = searchResults[0].id;
          console.log(`Adding movie with ID: ${movieId}`);
    
          const addResponse = await axios.post(`http://localhost:8080/api/users/${username}/movies`, movieId.toString());
          console.log('Add movie response:', addResponse.data);
    
          const movieDetails = await fetchMovieDetails(movieId.toString());
          console.log('Fetched movie details:', movieDetails);
    
          setCurrentlyWatching(prevState => [...prevState, movieDetails]);
          setMovieName('');
        } catch (error) {
          console.error('Error adding movie:', error);
          if (axios.isAxiosError(error) && error.response) {
            console.error('Error response:', error.response.data);
            alert(`Error adding movie: ${error.response.data.message || 'Please try again.'}`);
          } else {
            alert('Error adding movie. Please try again.');
          }
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
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    placeholder="Enter movie name"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    onClick={handleSearch}
                    className="bg-[#0D99FF] text-white p-2 rounded-r-md"
                >
                    Add Movie
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