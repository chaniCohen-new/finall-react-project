import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || "",
        user: localStorage.getItem("user") || "", // ✅ כבר string מ-localStorage
        isUserLoggedIn: !!localStorage.getItem("token"), // ✅ boolean בדרך נכונה
        message: '',
        error: ''
    },
    reducers: {
        setToken: (state, action) => {
            const { token, user } = action.payload;
            state.token = token;
            state.user = typeof user === 'string' ? user : JSON.stringify(user); // ✅ וודא שזה string
            state.isUserLoggedIn = true;
            state.error = '';
        },
        removeToken: (state) => {
            state.token = "";
            state.user = "";
            state.isUserLoggedIn = false;
            state.message = '';
            state.error = '';
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export default authSlice.reducer;
export const { setToken, removeToken, setMessage, setError } = authSlice.actions;
export const selectToken = (state) => state.auth.token;