import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#0D99FF] p-4">
            <ul className="flex justify-around list-none m-0 p-0">
                <li className="text-white text-2xl font-inter">
                    <Link to="/watchlist">My Watchlist</Link>
                </li>
                <li className="text-white text-2xl font-inter">
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
