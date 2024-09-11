import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login } = useUser();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (isLoginMode) {
          const response = await axios.post('https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/login', { username, password });
          if (response.data.success) {
            login(username);
            onClose();
          } else {
            alert('Login failed. Please try again.');
          }
        } else {
          const response = await axios.post('https://mymovielist-backend-321e199cbab8.herokuapp.com/api/users/register', { username, email, password });
          if (response.status === 200) {
            alert('Registration successful. Please log in.');
            setIsLoginMode(true);
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400) {
            alert('Username or email already exists. Please choose different credentials.');
          } else {
            alert('An error occurred. Please try again.');
          }
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      }
    };

    const toggleMode = () => {
      setIsLoginMode(!isLoginMode);
      setUsername('');
      setPassword('');
      setEmail('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl mb-4">{isLoginMode ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full mb-4 p-2 border rounded"
                    />
                    {!isLoginMode && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full mb-4 p-2 border rounded"
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full mb-4 p-2 border rounded"
                    />
                    <button type="submit" className="bg-[#0D99FF] text-white p-2 rounded">
                        {isLoginMode ? 'Login' : 'Register'}
                    </button>
                    <button type="button" onClick={onClose} className="ml-2 p-2">Cancel</button>
                </form>
                <p className="mt-4 text-sm">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleMode} className="text-[#0D99FF]">
                        {isLoginMode ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;