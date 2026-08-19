
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

interface User {
    id?: number;
    fullName?: string;
    email?: string;
    role: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    login: (
        token: string,
        user?: User
    ) => void;

    logout: () => void;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {

    const [token, setToken] =
        useState<string | null>(
            () => localStorage.getItem("token")
        );

    const [user, setUser] =
        useState<User | null>(
            () => {

                const savedUser =
                    localStorage.getItem("user");

                return savedUser
                    ? JSON.parse(savedUser)
                    : null;
            }
        );

    const login = (
        newToken: string,
        newUser?: User
    ) => {

        localStorage.setItem(
            "token",
            newToken
        );

        setToken(newToken);

        if (newUser) {

            localStorage.setItem(
                "user",
                JSON.stringify(newUser)
            );

            setUser(newUser);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    useEffect(() => {

        const savedToken =
            localStorage.getItem("token");

        const savedUser =
            localStorage.getItem("user");

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser) {

            try {

                setUser(
                    JSON.parse(savedUser)
                );

            } catch {

                localStorage.removeItem(
                    "user"
                );

                setUser(null);
            }
        }

    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

