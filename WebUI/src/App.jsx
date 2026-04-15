import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './AuthContext';

function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}

function MainRoutes() {
    const { token } = useAuth();
    
    return (
        <Routes>
            <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
            <Route 
                path="/" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}

function App() {
  return (
    <AuthProvider>
        <Router>
            <MainRoutes />
        </Router>
    </AuthProvider>
  );
}

export default App;
