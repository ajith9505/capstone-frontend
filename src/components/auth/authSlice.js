import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { email: null, password: null, accessToken: null },
    reducers: {
        setCredentials: (state, action) => {
            const { email, password, accessToken } = action.payload
            state.email = email
            state.password = password
            state.accessToken = accessToken
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token