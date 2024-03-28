import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../components/auth/authSlice'
import expensListReducer from "../components/expense/expensListSlice"
import editExpenseReducer from "../components/expense/editExpenseSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expense: expensListReducer,
        editExpense: editExpenseReducer
    },
    devTools: false
})