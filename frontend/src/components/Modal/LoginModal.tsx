import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8080/api/users/login', { username, password });
        if (response.data.success) {
          login(username);
          onClose();
        } else {
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full mb-4 p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full mb-4 p-2 border rounded"
                    />
                    <button type="submit" className="bg-[#0D99FF] text-white p-2 rounded">Login</button>
                    <button type="button" onClick={onClose} className="ml-2 p-2">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;