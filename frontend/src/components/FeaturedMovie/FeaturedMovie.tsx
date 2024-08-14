import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MovieDetails {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  genres?: { id: number; name: string }[];
  overview: string;
}

const FeaturedMovie: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<MovieDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/movies/trending');
        console.log('API Response:', response.data); // Log the entire response

        if (response.data && Array.isArray(response.data.results)) {
          setTrendingMovies(response.data.results);
        } else if (response.data && Array.isArray(response.data)) {
          setTrendingMovies(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setError('Failed to fetch trending movies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handlePrevious = () => {
    if (trendingMovies.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? trendingMovies.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (trendingMovies.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex === trendingMovies.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (trendingMovies.length === 0) {
    return <div>No trending movies available.</div>;
  }

  const currentMovie = trendingMovies[currentIndex];

  if (!currentMovie) {
    return <div>No movie data available.</div>;
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="relative z-10 container mx-auto min-h-screen px-4 py-8 flex flex-col md:flex-row items-center justify-center">
        {/* Content */}
        <div className="w-full md:w-1/2 text-white mb-8 md:mb-0 md:pr-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{currentMovie.title}</h2>
          <p className="mb-6 text-sm md:text-base">{currentMovie.overview}</p>
          <div className="flex flex-wrap mb-4">
            {currentMovie.genres && currentMovie.genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="mr-2 mb-2 text-xs md:text-sm bg-gray-800 px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm md:text-base">
              Watch now
            </button>
            <button className="border border-white text-white px-6 py-2 rounded-full text-sm md:text-base">
              Watch trailer
            </button>
          </div>
        </div>
        
        {/* Movie Poster */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img 
            src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
            alt={currentMovie.title}
            className="h-auto w-2/3 md:w-auto md:h-[600px] max-h-[80vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {trendingMovies.length > 1 && (
        <>
          <button 
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            &#8249;
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export default FeaturedMovie;