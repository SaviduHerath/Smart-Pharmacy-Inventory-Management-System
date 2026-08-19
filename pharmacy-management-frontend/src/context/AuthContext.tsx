import {
    createContext,
    useContext,
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
        useState<User | null>(() => {

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {
                return null;
            }

            try {
                return JSON.parse(savedUser);
            } catch {
                localStorage.removeItem("user");
                return null;
            }
        });


    // ============================
    // LOGIN
    // ============================

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


    // ============================
    // LOGOUT
    // ============================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


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