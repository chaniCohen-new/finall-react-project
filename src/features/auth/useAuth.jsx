import { useSelector } from "react-redux";
import { selectToken, selectUser, selectIsUserLoggedIn } from "./authSlice";

/**
 * ✅ useAuth - hook לקבלת פרטי המשתמש מ-Redux
 * 
 * שימוש:
 * const { userId, isAdmin, isTokenValid } = useAuth();
 * 
 * החזרה:
 * - userId: מזהה ייחודי של המשתמש
 * - username: שם משתמש
 * - fullname: שם מלא
 * - email: כתובת מייל
 * - isAdmin: האם הוא מנהל?
 * - isUser: האם הוא משתמש רגיל?
 * - isTokenValid: האם ה-token בתוקף?
 */
const useAuth = () => {
    // ✅ קבל מ-Redux
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

    // ✅ הגדר ערכי ברירת מחדל במקרה שה-user לא קיים
    const defaultAuth = {
        username: "",
        fullname: "",
        userId: "",
        email: "",
        isAdmin: false,
        isUser: false,
        isTokenValid: false,
    };

    // ✅ אם אין token או user, החזר ברירת מחדל
    if (!token || !user || !isUserLoggedIn) {
        return defaultAuth;
    }

    // ✅ החזר את המידע מ-user object ב-Redux
    return {
        username: user.username || "",
        fullname: user.name || "",
        userId: user.userId || "",
        email: user.email || "",
        isAdmin: user.role === "admin",
        isUser: user.role === "user",
        isTokenValid: true,
    };
};

export default useAuth;