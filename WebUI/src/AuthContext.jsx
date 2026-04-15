import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from './api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Kendi kullanıcı bilgilerimizi çekmek için bir endpoint'e gidebiliriz
            fetchUser(token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const fetchUser = async (jwt) => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setToken(null);
            }
        } catch (error) {
            console.error("User fetch error:", error);
            setToken(null);
        }
    };

    const login = (jwt) => {
        setToken(jwt);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
