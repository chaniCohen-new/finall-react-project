import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || "",
        user: localStorage.getItem("user") || "",
        isUserLoggedIn: localStorage.getItem("token") ? true : false,
        userFullName: "",
        message: '',  // הוסף את state להודעות
        error: ''     // הוסף את state לשגיאות
    },
    reducers: {
        setToken: (state, action) => {
            const token = action.payload.token;
            const user = action.payload.user;
            state.user = user;
            state.token = token;
            state.isUserLoggedIn = true;
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);
        },
        removeToken: (state) => {
            state.token = "";
            state.user = "";
            state.isUserLoggedIn = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setMessage: (state, action) => {
            state.message = action.payload;  // הגדרת ההודעה
        },
        setError: (state, action) => {
            state.error = action.payload;    // הגדרת השגיאה
        }
    }
});

export default authSlice.reducer;
export const { setToken, removeToken, setMessage, setError } = authSlice.actions; // הוסף את הפונקציות המיוצאות
export const selectToken = (state) => state.auth.token;