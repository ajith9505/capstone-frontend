import { useState, useEffect } from "react"
import { Formik, Form, Field } from 'formik'
import './ExpenseList.css'
import { jwtDecode } from "jwt-decode"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { setEditExpense, toggleEdit } from "./editExpenseSlice"
import { fetchData } from "../../components/auth/Welcome"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { setExpense } from "./expensListSlice"

const addBalance = async (values, axiosPrivate, currentBalance, showAddMoney, setShowAddMoney, dispatch, { setSubmitting, resetForm }) => {

  try {
    const response = await axiosPrivate({
      method: 'PUT',
      url: 'expense/add-balance',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ ...values, currentBalance })
    })
    setSubmitting(false)
    resetForm()
    setShowAddMoney(!showAddMoney)
    fetchData(axiosPrivate, dispatch)
  }
  catch (error) {
    // setError(error.message)
    setSubmitting(false);
  }
}

const handleEdit = (data, dispatch, navigateTo) => {
  dispatch(setEditExpense({ data: data }))
  dispatch(toggleEdit({ data: true }))
  navigateTo('/dash/expense-form')
}

//delete specified row
const deleteRow = async (userId, rowId, axiosPrivate, dispatch) => {
  try {
    axiosPrivate({
      method: 'DELETE',
      url: '/expense',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ userId, rowId })
    })
    fetchData(axiosPrivate, dispatch)
  }
  catch (error) {
    setError(error.message)
  }
}

const ExpenseList = () => {
  const [showAddMoney, setShowAddMoney] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const navigateTo = useNavigate()

  const dispatch = useDispatch()

  useEffect(() => {
    fetchData(axiosPrivate, dispatch)
  }, []);

  const token = localStorage.getItem("accessToken");
  const decodedToken = token ? jwtDecode(token) : {};
  const userId = decodedToken.user.id;

  const data = useSelector(state => state.expense)
  const currentBalance = data.currentBalance

  const addBalanceForm = (
    <div className="w-100 d-flex justify-content-end">
      <Formik
        initialValues={{ amount: '' }}
        onSubmit={(values, { setSubmitting, resetForm }) => addBalance(values, axiosPrivate, currentBalance, showAddMoney, setShowAddMoney, dispatch, setError, setIsLoading, { setSubmitting, resetForm })}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="d-flex flex-column">
              <div>
                <Field type="text" name="amount" className='form-control' />
              </div>
              <div className="mt-2">
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  Add
                </button>
                <button type="submit" className="btn btn-danger btn-block ms-2" onClick={() => setShowAddMoney(!showAddMoney)}>
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>)

  const table = (
    <div id="table-container" className="d-flex align-items-center mt-2">
      <div className="container">
        {/* <div className="row justify-content-center"> */}
        <div className="col-12 ">
          {/* <div className="card">
              <div className="card-body p-0"> */}
          <div className="table-responsive table-scroll" data-mdb-perfect-scrollbar="true" >
            {data?.message ?
              <h2>{data.message}</h2> :
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">S.NO</th>
                    <th scope="col">Date</th>
                    <th scope="col">Paid To</th>
                    <th scope="col">Paid For</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Description</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Creating row for each element */}
                  {data?.data?.map((exp, index) => (
                    <tr key={exp._id} className={index !== 0 && index % 2 !== 0 ? 'even-row' : 'odd-row'}>
                      <td>{index + 1}</td>
                      <td>{exp.date}</td>
                      <td>{exp.paidTo}</td>
                      <td>{exp.paidFor}</td>
                      <td>{exp.amount}</td>
                      <td>{exp.description}</td>
                      <td>{exp.balance}</td>
                      <td>
                        <button className='btn btn-primary px-3 py-1'
                          onClick={() => handleEdit(exp, dispatch, navigateTo)}
                          style={{ fontSize: '14px' }}><i className="bi bi-pen"></i><FontAwesomeIcon icon={faPen} /> Edit</button>
                        <button className='btn btn-danger p-1 ms-2 ' type="button" onClick={() => deleteRow(userId, exp._id, axiosPrivate, dispatch, setError, setIsLoading)} style={{ fontSize: '14px' }}><i className="bi bi-trash"></i><FontAwesomeIcon icon={faTrash} /> Delete</button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            }
          </div>
        </div>
      </div>
    </div>
    //     </div>
    //   </div>
    // </div>
  )

  return (
    <div className="vh-100">
      <div id="info-container">
        {(!showAddMoney) ? <div id="balance" className="p-2 flex-fill text-light">Current Balance: {data?.currentBalance}₹</div> : null}
        <div className="e-btn">
          {(!showAddMoney) ?
            <div>
              <button className="add-expense-btn btn btn-outline me-1 "
                onClick={() => {
                  dispatch(toggleEdit({ data: false }))
                  navigateTo('/dash/expense-form')
                }}>Add Expense</button>
              <button
                className="add-money-btn btn btn-outline me-1 "
                onClick={() => setShowAddMoney(!showAddMoney)}>Add Money</button>
            </div> : null}
        </div>
        {showAddMoney ? addBalanceForm : null}
      </div>
      {table}
    </div>

  )
}

export default ExpenseList