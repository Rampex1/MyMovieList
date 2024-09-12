import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../components/Modal/UserContext';
import AddMovieModal from '../components/Modal/AddMovieModal';
import { useNavigate } from 'react-router-dom';

export interface Movie {
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
    const [activeFilter, setActiveFilter] = useState('All Movies');
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchUserMovies();
        }
    }, [isLoggedIn, username]);

    const filterButtons = [
        'All Movies',
        'Currently Watching',
        'Completed',
        'Plan To Watch',
        'On-hold',
        'Dropped'
    ];

    const renderFilterButtons = () => (
        <div className="w-full lg:w-4/5 mx-auto mb-6 bg-blue-500 rounded-t-lg overflow-hidden">
            <div className="flex flex-wrap">
                {filterButtons.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`flex-1 px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium ${
                            activeFilter === filter
                                ? 'bg-white text-blue-500'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        } transition-colors duration-200 ease-in-out`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );

    const handleSearch = (movieId: string) => {
        navigate(`/movie/${movieId}`);
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

    const fetchUserMovies = async () => {
        try {
            const response = await axios.get(`https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/${username}/movies`);
            const movieEntries = response.data;
            const movieDetails = await Promise.all(movieEntries.map(fetchMovieDetails));
            setMovies(movieDetails);
        } catch (error) {
            console.error('Error fetching user movies:', error);
        }
    };

    const fetchMovieDetails = async (movieEntry: any) => {
        const response = await axios.get(`https://mymovielist-backend-321e199cbab8.herokuapp.com/api/movies/${movieEntry.movieId}`);
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
            await axios.put(`https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/${username}/movies/${selectedMovie.id}`, {
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
            await axios.delete(`https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/${username}/movies/${movieId}`);
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
            <table className="w-full lg:w-4/5 border-collapse bg-white border border-[#E3E3E3] mx-auto mb-12">
                <thead>
                    <tr>
                        <th colSpan={8} className="bg-white text-black font-inter p-2 text-left text-sm lg:text-base">
                            {status}
                        </th>
                    </tr>
                    <tr className="bg-[#0D99FF]">
                        <th className="hidden lg:table-cell font-inter text-white p-2 text-left text-xs">#</th>
                        <th className="font-inter text-white p-2 text-left text-xs">Title</th>
                        <th className="hidden lg:table-cell font-inter text-white p-2 text-left text-xs">Country</th>
                        <th className="hidden lg:table-cell font-inter text-white p-2 text-left text-xs">Year</th>
                        <th className="hidden lg:table-cell font-inter text-white p-2 text-left text-xs">Type</th>
                        <th className="font-inter text-white p-2 text-left text-xs">Score</th>
                        <th className="hidden lg:table-cell font-inter text-white p-2 text-left text-xs">Status</th>
                        <th className="font-inter text-white p-2 text-left text-xs">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMovies.map((movie, index) => (
                        <tr key={movie.id} className={index % 2 === 0 ? "bg-[#BDE3FF]" : "bg-white"}>
                            <td className="hidden lg:table-cell font-inter text-[#0D99FF] p-2 text-xs">{movie.id}</td>
                            <td 
                                className="font-inter text-[#0D99FF] p-2 hover:text-[#065f9f] cursor-pointer text-xs"
                                onClick={() => handleSearch(movie.id.toString())}
                            >{movie.title}</td>
                            <td className="hidden lg:table-cell font-inter text-[#0D99FF] p-2 text-xs">{movie.country}</td>
                            <td className="hidden lg:table-cell font-inter text-[#0D99FF] p-2 text-xs">{movie.year}</td>
                            <td className="hidden lg:table-cell font-inter text-[#0D99FF] p-2 text-xs">{movie.type}</td>
                            <td className="font-inter text-[#0D99FF] p-2 text-xs">{movie.score}</td>
                            <td className="hidden lg:table-cell font-inter text-[#0D99FF] p-2 text-xs">{movie.status}</td>
                            <td className="font-inter text-[#0D99FF] p-2 text-xs">
                                <button
                                    onClick={() => handleEditMovie(movie)}
                                    className="bg-blue-500 text-white p-1 rounded text-xs"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="flex flex-col items-center w-full pt-32 px-4 lg:px-32">
            <h1 className="text-xl lg:text-3xl font-bold mb-6">Welcome {username}!</h1>

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
                    onDelete={() => selectedMovie && handleDelete(selectedMovie.id.toString())}
                    movie={selectedMovie}
                />
            )}
        </div>
    );
};

export default Watchlist;