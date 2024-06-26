import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Watchlist from './pages/Watchlist/Watchlist';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
