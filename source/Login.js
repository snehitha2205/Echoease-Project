import React, { useState, createContext, useContext, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate, Route, Navigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import smartHomeVideo from './IOT.mp4';
import home from './SmartHome.mp4';
import light from './light.mp4';

// Create Authentication Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = ({ roleRequired }) => {
    const { isAuthenticated } = useAuth();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (roleRequired && user.role !== roleRequired) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

// AuthPage Component
const AuthPage = () => {
    return (
        <div className="app">
            <div className="left-section">
                <div className="form-container">
                    <h1 className="title">EchoEase</h1>
                    <LoginForm />
                </div>
            </div>
            <div className="right-section">
                <div className="carousel-container">
                    <Carousel>
                        <Carousel.Item>
                            <video autoPlay loop muted className="d-block w-100">
                                <source src={smartHomeVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <Carousel.Caption className="caption">
                                <h3 className="caption-title">Control Your Home with a Click!</h3>
                                <p className="caption-text">Turn your devices on or off effortlessly from anywhere, anytime!</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <video autoPlay loop muted className="d-block w-100">
                                <source src={light} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <Carousel.Caption className="caption">
                                <h3 className="caption-title">Make Your Home Smarter!</h3>
                                <p className="caption-text">Enjoy a lifestyle of convenience and efficiency with our innovative automation solutions.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <video autoPlay loop muted className="d-block w-100">
                                <source src={home} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <Carousel.Caption className="caption">
                                <h3 className="caption-title">Your Home, Your Rules!</h3>
                                <p className="caption-text">Personalize your living space by managing devices through our user-friendly interface.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

// LoginForm Component
const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3003/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                login();

                // Redirect based on user role
                if (data.user.role === 'user') {
                    navigate('/dashboard');
                } else if (data.user.role === 'admin') {
                    navigate('/AdminDashboard');
                }
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="form-content">
            {/* <h2>Login</h2> */}
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <input
                        type="text"
                        required
                        placeholder=" "
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Username</label>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        required
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="submit-btn">Login</button>
            </form>
        </div>
    );
};

export { AuthProvider, ProtectedRoute };
export default AuthPage;
