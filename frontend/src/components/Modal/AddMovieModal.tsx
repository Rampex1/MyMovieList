import React, { useState, useEffect } from 'react';

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
  movie: Movie | null;
}

const AddMovieModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, movie }) => {
    const [status, setStatus] = useState(movie?.status || '');
    const [score, setScore] = useState<number>(movie?.score || 0);

    useEffect(() => {
        if (movie) {
          setStatus(movie.status || '');
          setScore(movie.score || 0);
        } else {
          setStatus('');
          setScore(0);
        }
      }, [movie]);
    
      if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(status, score);
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
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
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i / 2}>{i / 2}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
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
  );
};

export default AddMovieModal;