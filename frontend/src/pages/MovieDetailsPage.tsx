import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../components/Modal/UserContext';
import TrailerModal from '../components/Modal/TrailerModal';

interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  production_countries: { iso_3166_1: string }[];
  status: string;
  runtime: number;
  budget: number;
  revenue: number;
}

interface Credits {
  crew: { job: string; name: string }[];
  cast: { 
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [director, setDirector] = useState<string>('');
  const [cast, setCast] = useState<Credits['cast']>([]);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const { isLoggedIn, username } = useUser();
  const navigate = useNavigate();
  const apiKey = "e43f973af82ec44359fdd966c0401d8f";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsResponse, creditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
        ]);
        setMovieDetails(detailsResponse.data);
        const directorInfo = (creditsResponse.data as Credits).crew.find(person => person.job === 'Director');
        setDirector(directorInfo ? directorInfo.name : 'Unknown');
        setCast(creditsResponse.data.cast);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id, apiKey]);

  const handleWatchTrailer = async () => {
    if (!movieDetails) return;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos?api_key=${apiKey}`);
      const videos = response.data.results;
      const trailer = videos.find((video: any) => video.type === 'Trailer');
      if (trailer) {
        setTrailerKey(trailer.key);
        setIsTrailerModalOpen(true);
      } else {
        alert('No trailer available for this movie.');
      }
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      alert('Error fetching movie trailer. Please try again.');
    }
  };

  const handleAddToList = async () => {
    if (!isLoggedIn) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }
    if (!movieDetails) return;
    
    try {
      await axios.post(
        `https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/${username}/movies`,
        { 
          movieId: movieDetails.id.toString(),
          status: 'Plan to Watch',
          score: 0
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Movie added to your watchlist!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error adding movie. Please try again.');
    }
  };

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  const {
    title,
    release_date,
    poster_path,
    vote_average,
    vote_count,
    overview,
    production_countries,
    status,
    runtime,
    budget,
    revenue
  } = movieDetails;

  const year = new Date(release_date).getFullYear();
  const country = production_countries[0]?.iso_3166_1 || 'Unknown';
  const formattedRuntime = `${Math.floor(runtime / 60)}h${runtime % 60}m`;

  return (
    <div className="bg-gray-100 min-h-screen py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center space-x-0 md:space-x-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 md:mb-0 w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{title} ({year})</h1>
          <div className="h-px bg-gray-300 mb-4"></div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img 
                src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
                alt={`${title} poster`}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="mt-4 space-y-2">
                <button 
                  onClick={handleWatchTrailer}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Watch Trailer
                </button>
                <button 
                  onClick={handleAddToList}
                  className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add to List
                </button>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500 text-white text-2xl font-bold p-4 rounded-lg">
                  {vote_average.toFixed(1)}
                </div>
                <div className="ml-4">
                  <p className="mb-1">Ratings: {vote_average.toFixed(1)} / 10 from {vote_count} users</p>
                  <p>Movie ID: {id}</p>
                </div>
              </div>
              <div className="h-px bg-gray-300 mb-4"></div>
              <p className="text-lg mb-4">{overview}</p>
              <p className="mb-2"><strong>Director</strong>: {director}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/3">
          <div className="bg-[#0D99FF] text-white p-2">
            <h2 className="text-2xl font-bold">Details</h2>
          </div>
          <div className="p-4">
            <p><strong>Movie:</strong> {title}</p>
            <p><strong>Country:</strong> {country}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Release Date:</strong> {release_date}</p>
            <p><strong>Duration:</strong> {formattedRuntime}</p>
            <p><strong>Budget:</strong> ${budget.toLocaleString()}</p>
            <p><strong>Revenue:</strong> ${revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {cast.map((actor) => (
              <div key={actor.id} className="flex-none w-40">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-avatar.png'}
                  alt={actor.name}
                  className="w-full h-56 object-cover rounded-lg shadow-md"
                />
                <p className="mt-2 font-bold text-sm">{actor.name}</p>
                <p className="text-sm text-gray-600">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <TrailerModal
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        trailerKey={trailerKey}
      />
    </div>
  );
};

export default MovieDetailsPage;
