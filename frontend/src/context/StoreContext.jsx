import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) =>{

    const url = "https://skill-voyage-api.vercel.app"
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    const contextValue = {
        url,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
