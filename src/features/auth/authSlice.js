import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// ✅ פונקציית עזר בטוחה להתחלה
const getSafeInitialState = () => {
    try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        
        return {
            token: token || null,
            user: userString ? JSON.parse(userString) : null, // ✅ בדיקה בפני parse
            isUserLoggedIn: !!token,
            message: "",
            error: "",
        };
    } catch (error) {
        console.error("❌ Error initializing auth state:", error);
        // ✅ אם יש שגיאה, נקה את localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        return {
            token: null,
            user: null,
            isUserLoggedIn: false,
            message: "",
            error: "",
        };
    }
};

const initialState = getSafeInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            let payload = action.payload;
            let token = payload;
            let userData = null;

            // ✅ בדוק אם payload הוא object עם token ו-user
            if (payload && typeof payload === "object" && payload.token) {
                token = payload.token;
                userData = payload.user || null;
            } else if (payload && typeof payload === "object" && payload.accessToken) {
                token = payload.accessToken;
                userData = payload.user || null;
            }

            // ✅ בדיקה: אם token לא string - בטל
            if (!token || typeof token !== "string") {
                console.error("❌ Invalid token received:", token);
                state.token = null;
                state.user = null;
                state.isUserLoggedIn = false;
                state.error = "Invalid token format";
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                return;
            }

            state.token = token;
            state.isUserLoggedIn = true;
            state.error = "";

            try {
                const decoded = jwtDecode(token);
                console.log("✅ Decoded token:", decoded);

                // ✅ בדוק expiration
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.warn("❌ Token expired");
                    state.token = null;
                    state.user = null;
                    state.isUserLoggedIn = false;
                    state.error = "Token expired";
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    return;
                }

                // ✅ אם יש user data מה-API, השתמש בו
                if (userData) {
                    // ✅ בטוח parse אם userData הוא string
                    if (typeof userData === "string") {
                        try {
                            state.user = JSON.parse(userData);
                        } catch (e) {
                            console.error("❌ Error parsing userData:", e);
                            state.user = userData; // ✅ אם לא JSON, השתמש כמו שהוא
                        }
                    } else {
                        state.user = userData;
                    }
                } else {
                    // אחרת חלץ מה-token
                    state.user = {
                        userId: decoded.userId || decoded._id || "",
                        role: decoded.role || "user",
                        email: decoded.email || "",
                        username: decoded.username || decoded.user || "",
                        name: decoded.name || "",
                    };
                }

                console.log("✅ User saved to Redux:", state.user);

                // ✅ שמור ב-localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(state.user));
                state.message = "Login successful";
            } catch (error) {
                console.error("❌ Error decoding token:", error);
                state.token = null;
                state.user = null;
                state.isUserLoggedIn = false;
                state.error = "Failed to decode token";
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        },

        removeToken: (state) => {
            state.token = null;
            state.user = null;
            state.isUserLoggedIn = false;
            state.message = "";
            state.error = "";
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        hydrateAuth: (state) => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (token && typeof token === "string") {
                try {
                    const decoded = jwtDecode(token);
                    console.log("✅ Hydrating from localStorage:", decoded);

                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.warn("❌ Token expired during hydration");
                        state.token = null;
                        state.user = null;
                        state.isUserLoggedIn = false;
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        return;
                    }

                    state.token = token;
                    state.isUserLoggedIn = true;

                    // ✅ טען user מ-localStorage בטוח
                    if (savedUser) {
                        try {
                            state.user = JSON.parse(savedUser);
                        } catch (e) {
                            console.error("❌ Error parsing saved user:", e);
                            state.user = {
                                userId: decoded.userId || decoded._id || "",
                                role: decoded.role || "user",
                                email: decoded.email || "",
                                username: decoded.username || decoded.user || "",
                                name: decoded.name || "",
                            };
                        }
                    } else {
                        state.user = {
                            userId: decoded.userId || decoded._id || "",
                            role: decoded.role || "user",
                            email: decoded.email || "",
                            username: decoded.username || decoded.user || "",
                            name: decoded.name || "",
                        };
                    }

                    console.log("✅ User hydrated:", state.user);
                } catch (error) {
                    console.error("❌ Error hydrating auth:", error);
                    state.token = null;
                    state.user = null;
                    state.isUserLoggedIn = false;
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        },

        setMessage: (state, action) => {
            state.message = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export default authSlice.reducer;
export const { setToken, removeToken, hydrateAuth, setMessage, setError } = authSlice.actions;

// ✅ Selectors
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user || null;
export const selectUserId = (state) => state.auth.user?.userId || "";
export const selectIsUserLoggedIn = (state) => state.auth.isUserLoggedIn;
export const selectError = (state) => state.auth.error;
export const selectMessage = (state) => state.auth.message;