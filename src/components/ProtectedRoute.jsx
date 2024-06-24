import {Navigate, Outlet} from "react-router-dom"
import { useAuth } from "../services/AuthService"

export const ProtectedRoute = () => {
    const {token} = useAuth();


    if (!token) {
        // if not authenticated, redirect to the login page
        return <Navigate to={"/login"} replace={true} />
    }

    // if authenticated, redirect to child routes
    return <Outlet />
}