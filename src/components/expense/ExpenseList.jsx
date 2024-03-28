import { useState, useEffect } from "react"
import { Formik, Form, Field } from 'formik'
import './ExpenseList.css'
import { jwtDecode } from "jwt-decode"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { setEditExpense, toggleEdit } from "./editExpenseSlice"
import { fetchData } from "../../components/auth/Welcome"

const addBalance = async (values, axiosPrivate, currentBalance, showAddMoney, setShowAddMoney, dispatch, setError, setIsLoading, { setSubmitting, resetForm }) => {

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
    fetchData(axiosPrivate, dispatch, setError, setIsLoading)
  }
  catch (error) {
    setError(error.message)
    setSubmitting(false);
  }
}

const handleEdit = (data, dispatch, navigateTo) => {
  dispatch(setEditExpense({ data: data }))
  dispatch(toggleEdit({ data: true }))
  navigateTo('/dash/expense-form')
}

//delete specified row
const deleteRow = async (userId, rowId, axiosPrivate, dispatch, setError, setIsLoading) => {
  try {
    axiosPrivate({
      method: 'DELETE',
      url: '/expense',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ userId, rowId })
    })
    fetchData(axiosPrivate, dispatch, setError, setIsLoading)
  }
  catch (error) {
    setError(error.message)
  }
}

const ExpenseList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMoney, setShowAddMoney] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const navigateTo = useNavigate()

  const dispatch = useDispatch()

  useEffect(() => {
    fetchData(axiosPrivate, dispatch, setError, setIsLoading)
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
      <div className="mask d-flex align-items-center mt-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive table-scroll" data-mdb-perfect-scrollbar="true" style={{ position: 'relative', height: '700px' }}>
                    {data?.message ?
                      <h2>{data.message}</h2> :
                      <table className="table table-striped mb-0">
                        <thead>
                          <tr style={{ backgroundColor: "#ffeaa5" }}>
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
                            <tr key={exp._id}>
                              <td>{index + 1}</td>
                              <td>{exp.date}</td>
                              <td>{exp.paidTo}</td>
                              <td>{exp.paidFor}</td>
                              <td>{exp.amount}</td>
                              <td>{exp.description}</td>
                              <td>{exp.balance}</td>
                              <td>
                                <button className='btn btn-primary p-1 '
                                  onClick={() => handleEdit(exp, dispatch, navigateTo)}
                                  style={{ fontSize: '14px' }}><i className="bi bi-pen"></i> Edit</button>
                                <button className='btn btn-danger p-1 ms-2 ' type="button" onClick={() => deleteRow(userId, exp._id, axiosPrivate, dispatch, setError, setIsLoading)} style={{ fontSize: '14px' }}><i className="bi bi-trash"></i> Delete</button>
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
          </div>
        </div>
      </div>
  )

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div className="d-flex mt-3 align-items-center">
        {(!showAddMoney) ? <div className="p-2 flex-fill text-light">Current Balance: {data?.currentBalance} Rs</div> : null}
        <div className="p-2 d-flex justify-content-end flex-fill">
          <div className="mb-2">
            <section>
              {(!showAddMoney) ?
                <div>
                  <button className="btn btn-outline me-1 "
                    style={{ backgroundColor: '#bff4ed' }}
                    onClick={() => {
                      dispatch(toggleEdit({ data: false }))
                      navigateTo('/dash/expense-form')
                    }}>Add Expense</button>
                  <button
                    className="btn btn-outline me-1 "
                    style={{ backgroundColor: '#d4abdc' }}
                    onClick={() => setShowAddMoney(!showAddMoney)}>Add Money</button>
                </div> : null}
            </section>
          </div>
        </div>
        {showAddMoney ? addBalanceForm : null}
      </div>
      {table}
    </div>

  )
}

export default ExpenseList