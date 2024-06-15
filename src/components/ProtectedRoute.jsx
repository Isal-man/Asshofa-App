import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

export const ProtectedRoute = ({children}) => {
    const {token,setToken} = useContext(AuthContext)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"))
        setToken(data?.token)
        console.log(token, "ini token");
    }, [token, setToken])

    return token ? (children) : (<Navigate to={"/login"} replace={true} />)
}