import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children })
{
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (!token)
        {
            return null;
        }

        try
        {
            const decodedUser = jwtDecode(token);

            if (decodedUser.exp * 1000 < Date.now())
            {
                localStorage.removeItem("token");
                return null;
            }

            return decodedUser;
        }
        catch(err)
        {
            localStorage.removeItem("token");
            return null;
        }
    });

    const isLoggedIn = !!user;

    function login(token)
    {
        localStorage.setItem("token", token);

        const decodedUser = jwtDecode(token);

        setUser(decodedUser);
    }

    function logout()
    {
        localStorage.removeItem("token");
        setUser(null);
    }

    return(
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}