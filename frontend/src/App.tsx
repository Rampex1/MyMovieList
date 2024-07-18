import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Search from './pages/Search';

function App() {
  return (
    <div className="App min-h-screen bg-[#E9EAED]">
      <Navbar />
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
