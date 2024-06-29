import { createSlice } from "@reduxjs/toolkit"

const loadingSlice = createSlice({
    name: 'loading',
    initialState: { loading: false },
    reducers: {
        setLoading: (state, action) => {
            const {loading} = action.payload
            state.loading = loading
        }
    }
})

export default loadingSlice.reducer
export const { setLoading } = loadingSlice.actions