import { useEffect, useState } from 'react';

interface User {
    name: string;
}

export const useAuth = () => {
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

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_name');
        localStorage.removeItem('access_token');
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };
};

