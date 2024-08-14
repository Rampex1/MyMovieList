import React from 'react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, trailerKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Movie Trailer</h2>
          <button 
            onClick={onClose}
            className="text-black hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="relative" style={{paddingTop: '56.25%'}}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;