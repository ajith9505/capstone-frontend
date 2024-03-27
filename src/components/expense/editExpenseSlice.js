import { createSlice } from "@reduxjs/toolkit"

const editExpenseSlice = createSlice({
    name: 'editExpense',
    initialState: { data: null },
    reducers: {
        setEditExpense: (state, action) => {
            const { data } = action.payload
            state.data = data
            state.edit = !state.edit
        }, 
        toggleEdit : (state, action) => {
            const {data} = action.payload
            state.edit = data
        }
    },
})

export const { setEditExpense, toggleEdit } = editExpenseSlice.actions

export default editExpenseSlice.reducer