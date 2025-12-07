import { useSelector } from "react-redux";
import { selectToken } from "./authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectToken);
    let isAdmin = false;
    let isUser = false;
    let username = "";
    let fullname = "";

    if (token) {
        const userDecoded = jwtDecode(token);
        console.log("userDecoded", userDecoded);
        const { username: user, name, role, _id, email } = userDecoded;
        username = user;
        fullname = name;
        isAdmin = role === "admin";
        isUser = role === "user";
    }

    return { username, fullname, isAdmin, isUser };
};

export default useAuth;
