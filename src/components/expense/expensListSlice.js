import { createSlice } from "@reduxjs/toolkit"

const expenseListSlice = createSlice({
    name: 'expense',
    initialState: { data : null, currentBalance: null, message: null },
    reducers: {
        setExpense: (state, action) => {
            const { data, currentBalance, message, loading } = action.payload
            state.data = data
            state.currentBalance = currentBalance
            state.message = message
        }
    },
})

export const { setExpense } = expenseListSlice.actions

export default expenseListSlice.reducer