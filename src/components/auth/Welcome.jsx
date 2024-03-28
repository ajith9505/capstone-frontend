import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'

import { toggleEdit } from '../../components/expense/editExpenseSlice'
import { setExpense } from '../../components/expense/expensListSlice'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

export const fetchData = async (axiosPrivate, dispatch, setError, setIsLoading) => {
    try {
        const response = await axiosPrivate({
            url: '/expense',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        dispatch(setExpense(response.data))
    }
    catch (error) {
        setError(error.message)
    }
    finally {
        setIsLoading(false)
    }
}

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


const Welcome = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showAddMoney, setShowAddMoney] = useState(false)

    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const axiosPrivate = useAxiosPrivate()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'full',
        timeStyle: 'long'
    })
        .format(date)

    useEffect(() => {
        fetchData(axiosPrivate, dispatch, setError, setIsLoading)
    }, []);

    const data = useSelector(state => state.expense)
    const currentBalance = data.currentBalance


    let spendings = 0
    data?.data?.forEach(expense => {
        return spendings += expense.amount
    })
    let postageTelegram = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Postage and Telegram') return postageTelegram += expense.amount
    })
    let printing = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Printing and Stationary') return printing += expense.amount
    })
    let carriage = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Carriage') return carriage += expense.amount
    })
    let travel = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Traveling expenses') return travel += expense.amount
    })
    let refreshment = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Refreshmnet') return refreshment += expense.amount
    })
    let miscellaneous = 0
    data?.data?.forEach(expense => {
        if (expense.paidFor == 'Miscellaneous expenses') return miscellaneous += expense.amount
    })

    if (isLoading) return <p>Loading...</p>

    if (error) return <p>Error: {error}</p>

    return (
        <div className='welcome position-relative'>
            <div className='d-flex flex-column align-items-center text-center'>
                <div className="text-dark" style={{ width: '100%' }}>
                    <div className="row" style={{ width: '100%', marginLeft: '1px' }}>
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 pt-3" style={{ backgroundColor: '#fce38a' }}>
                            <p className='text-dark'>{today}</p>
                        </div>
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 pt-3" style={{ backgroundColor: '#eaffd0' }}>
                            <p><Link className='text-dark text-decoration-none' to="/dash/expense">View Expenses</Link></p>
                        </div>
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 pt-3" style={{ backgroundColor: '#95e1d3' }}>
                            <button className='border-0' style={{ backgroundColor: '#95e1d3' }} onClick={() => {
                                dispatch(toggleEdit({ data: false }))
                                navigateTo('/dash/expense-form')
                            }}>
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row w-100" style={{ marginTop: "5rem" }}>
                    <div className="col-12 col-lg-6 col-xl-6 col-xxl-6 mb-5">
                        <div className="card" style={{ backgroundColor: '#e0ffcd' }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    Available Balance
                                </h5>
                                <div className="card-text">
                                    {data.currentBalance || 0} Rs
                                </div>
                                {(!showAddMoney) ?
                                    <div>
                                        <div className="card-text">
                                            <button style={{ backgroundColor: '#8b76a5' }}
                                                onClick={() => setShowAddMoney(!showAddMoney)}
                                                className='btn btn-outline text-light'>Add Balance</button>
                                        </div>
                                    </div>
                                    :
                                    <Formik
                                        initialValues={{ amount: '' }}
                                        onSubmit={(values, { setSubmitting, resetForm }) => addBalance(values, axiosPrivate, currentBalance, showAddMoney, setShowAddMoney, dispatch, setError, setIsLoading, { setSubmitting, resetForm })}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <div className="d-flex">
                                                    <div>
                                                        <Field type="text" name="amount" className="form-control" />
                                                    </div>
                                                    <div className=" ms-2">
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
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-6 col-xxl-6 mb-5">
                        <div className="card" style={{ backgroundColor: '#e0ffcd' }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    Total Spendings
                                </h5>
                                <div className="card-text">{spendings} Rs</div>
                                <div className="card-text">
                                    <Link style={{ backgroundColor: '#8b76a5' }} className='btn btn-outline text-light text-decoration-none' to="/dash/expense">View Expenses</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row w-100 justify-content-center ms-1" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                        <div className="col-12 col-lg-6 col-xl-6 col-xxl-6 mb-5">
                            <div className="card" style={{ backgroundColor: '#e0ffcd' }}>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Total Spendings by Category
                                    </h5>
                                    <div className="card-text">Postage and Telegram : {postageTelegram} Rs</div>
                                    <div className="card-text">Printing and Stationary : {printing} Rs</div>
                                    <div className="card-text">Carriage : {carriage} Rs</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 col-xl-6 col-xxl-6 mb-5">
                            <div className="card" style={{ backgroundColor: '#e0ffcd' }}>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Total Spendings by Category
                                    </h5>
                                    <div className="card-text">Traveling expenses : {travel} Rs</div>
                                    <div className="card-text">Refreshmnet : {refreshment} Rs</div>
                                    <div className="card-text">Miscellaneous expenses : {miscellaneous} Rs</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Welcome