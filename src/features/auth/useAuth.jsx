import { useSelector } from "react-redux";
import { selectToken } from "./authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectToken);
    
    // ✅ הגדר ערכי ברירת מחדל
    const defaultAuth = {
        username: "",
        fullname: "",
        userId: "",
        email: "",
        isAdmin: false,
        isUser: false,
        isTokenValid: false,
    };

    if (!token) {
        return defaultAuth;
    }

    try {
        const userDecoded = jwtDecode(token);

        // ✅ בדוק expiration
        const currentTime = Date.now() / 1000;
        if (userDecoded.exp && userDecoded.exp < currentTime) {
            console.warn("Token expired");
            return defaultAuth;
        }

        const { 
            username: user = "", 
            name = "", 
            role = "user", 
            _id = "", 
            email: userEmail = "" 
        } = userDecoded;

        return {
            username: user,
            fullname: name,
            userId: _id,
            email: userEmail,
            isAdmin: role === "admin",
            isUser: role === "user",
            isTokenValid: true,
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return defaultAuth;
    }
};

export default useAuth;