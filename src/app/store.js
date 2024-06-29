import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../components/auth/authSlice'
import expensListReducer from "../components/expense/expensListSlice"
import editExpenseReducer from "../components/expense/editExpenseSlice"
import loadingSliceReducer from "../loadingSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expense: expensListReducer,
        editExpense: editExpenseReducer,
        loding: loadingSliceReducer
    },
    devTools: true
})