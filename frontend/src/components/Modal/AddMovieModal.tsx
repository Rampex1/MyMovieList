import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  status: string;
  score: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: string, score: number) => void;
  onDelete: () => void;
  movie: Movie | null;
}

const AddMovieModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, onDelete, movie }) => {
    const [status, setStatus] = useState(movie?.status || '');
    const [score, setScore] = useState<number>(movie?.score || 0);
    const [posterUrl, setPosterUrl] = useState<string | null>(null);

    useEffect(() => {
      if (movie) {
        setStatus(movie.status || '');
        setScore(movie.score || 0);
        fetchPoster(movie.id);
      } else {
        setStatus('');
        setScore(0);
        setPosterUrl(null);
      }
    }, [movie]);

    const fetchPoster = async (movieId: number) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
        const posterPath = response.data.poster_path;
        if (posterPath) {
          setPosterUrl(`https://image.tmdb.org/t/p/w300${posterPath}`);
        }
      } catch (error) {
        console.error('Error fetching movie poster:', error);
      }
    };

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(status, score);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg flex" style={{ width: '800px' }}>
          <div className="w-1/3 pr-4">
            {posterUrl && <img src={posterUrl} alt={movie?.title} className="w-full rounded" />}
          </div>
          <div className="w-2/3">
            <h2 className="text-xl font-bold mb-4">{movie ? `Edit ${movie.title}` : 'Add Movie'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <label htmlFor="status" className="block mb-2">Status:</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="Currently Watching">Currently Watching</option>
                <option value="Plan To Watch">Plan To Watch</option>
                <option value="Completed">Completed</option>
                <option value="On-hold">On-hold</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="score" className="block mb-2">Score:</label>
              <select
                id="score"
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Score</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onDelete}
                  className="bg-red-500 text-white p-2 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-black p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {movie ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
export default AddMovieModal;
