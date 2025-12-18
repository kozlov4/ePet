import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContextType, AuthProviderProps, User } from '../types/api';

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [organizationType, setOrganizationType] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            const storedToken = localStorage.getItem('access_token');
            const storedOrgType = localStorage.getItem('organization_type');

            if (storedUserName && storedToken) {
                setUser({ name: storedUserName });
                setOrganizationType(storedOrgType);
            }
            setLoading(false);
        }
    }, []);

    const login = (userData: User, token: string, orgType?: string) => {
        setUser(userData);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('access_token', token);

        if (orgType) {
            setOrganizationType(orgType);
            localStorage.setItem('organization_type', orgType);
        } else {
            setOrganizationType(null);
            localStorage.removeItem('organization_type');
        }
    };

    const logout = () => {
        toast.dismiss();
        setUser(null);
        setOrganizationType(null);
        localStorage.removeItem('user_name');
        localStorage.removeItem('access_token');
        localStorage.removeItem('organization_type');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        organizationType,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
