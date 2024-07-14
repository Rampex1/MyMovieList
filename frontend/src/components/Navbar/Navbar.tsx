import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../Modal/LoginModal';
import { useUser } from '../Modal/UserContext'; 

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { isLoggedIn, username, logout } = useUser();

    const handleLogin = (loggedInUsername: string) => {
        // You can call a login function from useUser here if necessary
        setIsLoginModalOpen(false);
    };

    return (
        <nav className="bg-[#0D99FF] h-[80px] relative mb-[40px]">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                <div className="text-white text-3xl font-bold font-inter pl-2 sm:pl-4">
                    MyMovieList
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden text-white focus:outline-none"
                >
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                        ) : (
                            <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                        )}
                    </svg>
                </button>
                <ul className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative top-[80px] lg:top-0 left-0 right-0 lg:left-auto lg:right-auto flex-col lg:flex-row bg-[#0D99FF] lg:bg-transparent`}>
                    <li className="text-white text-2xl font-inter p-4 lg:p-0 lg:ml-8">
                        <Link to="/watchlist" className="block lg:inline-block">My Watchlist</Link>
                    </li>
                    <li className="text-white text-2xl font-inter p-4 lg:p-0 lg:ml-12">
                        <Link to="/profile" className="block lg:inline-block">Profile</Link>
                    </li>
                    <li className="text-white text-2xl font-inter p-4 lg:p-0 lg:ml-12">
                        {isLoggedIn ? (
                            <>
                                <span>Welcome, {username}</span>
                                <button onClick={logout}>Logout</button>
                            </>
                        ) : (
                            <button onClick={() => setIsLoginModalOpen(true)}>Login</button>
                        )}
                    </li>
                </ul>
                <LoginModal 
                    isOpen={isLoginModalOpen} 
                    onClose={() => setIsLoginModalOpen(false)} 
                    onLogin={handleLogin} 
                />
            </div>
        </nav>
    );
};

export default Navbar;
