import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';

function App() {
  return (
    <div className="App min-h-screen bg-[#E9EAED]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
