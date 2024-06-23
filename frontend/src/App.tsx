import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import MyMovieList from './pages/MyMovieList/MyMovieList';

function App() {
  return (
    <div className="App">
      <Navbar />
      <MyMovieList />
    </div>
  );
}

export default App;
