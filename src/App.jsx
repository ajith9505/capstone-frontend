import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import DashLayout from "./components/DashLayout"
import Welcome from "./components/auth/Welcome"
import ExpenseList from "./components/expense/ExpenseList"
import ExpenseForm from "./components/expense/ExpenseForm"
import RequireAuth from "./components/auth/RequireAuth"

function App() {

  return (
    <Routes>

      {/* public routes */}
      <Route path='*' element={<Navigate to="login" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />
            <Route path="expense-form" element={<ExpenseForm />} />
            <Route path="expense">
              <Route index element={<ExpenseList />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
