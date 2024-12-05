import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage, { AuthProvider, ProtectedRoute } from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
