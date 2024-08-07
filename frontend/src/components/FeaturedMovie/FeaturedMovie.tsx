import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MovieDetails {
  title: string;
  backdrop_path: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  overview: string;
}

const FeaturedMovie: React.FC = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/movies/372058');
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, []);

  if (!movieDetails) return null;

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`,
        }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="relative z-10 container mx-auto h-full flex items-center">
        {/* Left side content */}
        <div className="w-1/2 text-white">
          <h2 className="text-4xl font-bold mb-4">{movieDetails.title}</h2>
          <p className="mb-6 text-sm">{movieDetails.overview}</p>
          <div className="flex mb-4">
            {movieDetails.genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="mr-2 text-sm bg-gray-800 px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="flex space-x-4">
            <button className="bg-red-600 text-white px-6 py-2 rounded-full">
              Watch now
            </button>
            <button className="border border-white text-white px-6 py-2 rounded-full">
              Watch trailer
            </button>
          </div>
        </div>
        
        {/* Right side - Movie Poster */}
        <div className="w-1/2 flex justify-end">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="h-3/4 w-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;