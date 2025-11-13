import { createContext, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, User } from "../types/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            const storedToken = localStorage.getItem('access_token');

            if (storedUserName && storedToken) {
                setUser({ name: storedUserName });
            }
            setLoading(false);
        }
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('access_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_name');
        localStorage.removeItem('access_token');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
