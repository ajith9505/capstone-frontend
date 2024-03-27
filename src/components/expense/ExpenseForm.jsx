import { useSelector } from 'react-redux';
import './ExpenseForm.css'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { toggleEdit, setEditExpense } from './editExpenseSlice';

//Validation schema for inputs
const ValidateSchema = Yup.object().shape({
  date: Yup.date()
    .required('Required'),
  paidTo: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  paidFor: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  amount: Yup.number()
    .required('Required'),
  description: Yup.string(),
});

//add new expense in list
const addNewExpense = (values, userId, axiosPrivate, navigateTo, { setSubmitting, resetForm }) => {
  axiosPrivate({
    url: '/expense',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ userId, ...values })
  })
    .then(response => {
      setSubmitting(false);
      resetForm();
      navigateTo('/dash/expense')
    })
    .catch(error => {
      setSubmitting(false);
    })
}

//Edit specified row
const editRow = async (values, userId, axiosPrivate, navigateTo, dispatch, { setSubmitting, resetForm }) => {
  try {
    const response = await axiosPrivate({
      method: 'PATCH',
      url: '/expense',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ userId, rowId: values._id, ...values })
    })
    setSubmitting(false);
    resetForm();
    dispatch(toggleEdit({ data: false }))
    dispatch(setEditExpense({ data: null }))
    navigateTo('/dash/expense')
  }
  catch (error) {
    console.error('Error:', error);
    setSubmitting(false);
  }
}

const initValues = {
  date: '',
  paidTo: '',
  paidFor: '',
  amount: '',
  description: ''
}


//functional component
const ExpenseForm = () => {

  const navigateTo = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch();

  const decodedToken = jwtDecode(localStorage.getItem('accessToken'))
  const userId = decodedToken.id

  const editData = useSelector(state => state.editExpense)

  const editInitialValues = editData.data
  const edit = editData.edit

  const options = ['Postage and Telegram', 'Printing and Stationary', 'Carriage', 'Traveling expenses', 'Refreshmnet', 'Miscellaneous expenses']

  return (
    <Formik
      initialValues={(edit) ? editInitialValues : initValues}
      validationSchema={ValidateSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {

        if (!edit) {
          addNewExpense(values, userId, axiosPrivate, navigateTo, { setSubmitting, resetForm });
        }
        else {
          editRow(values, userId, axiosPrivate, navigateTo, dispatch, { setSubmitting, resetForm });
        }
      }}>
      {({ isSubmitting }) => (

        <Form className="m-5">
          <div className='form-wrapper'>
            <div className="container form-main">
              <div className="form-input-box">
                <header>Add new expense</header>
                {/* Date field */}
                <div className="form-input-field mb-4">
                  <label className="form-label" htmlFor="date"></label>
                  <Field type="date" name="date" className="form-input" required />
                  <ErrorMessage name='date' >
                    {msg => <div className="text-danger">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Paid to field */}
                <div className="form-input-field mb-4">
                  <Field type="text" name='paidTo' className="form-input" autoComplete='off' required />
                  <label className="form-label" htmlFor="paidto" >Paid To</label>
                  <ErrorMessage className="text-danger" name='paidTo' >
                    {msg => <div className="text-danger">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Paid for field */}
                <div className="form-inpu-field mb-4">
                  <Field className="form-input" as="select" name='paidFor'>
                    <option defaultValue>Select Paid For</option>
                    {
                      options.map((option, index) => <option
                        key={index}
                        value={option}
                      >{option}</option>)
                    }
                  </Field>
                  <ErrorMessage className="text-danger" name='paidTo' >
                    {msg => <div className="text-danger">{msg}</div>}
                  </ErrorMessage>
                  {/* <label className="form-label" htmlFor="paidFor">Paid For</label> */}
                </div>

                {/* Amount field */}
                <div className="form-input-field mb-4">
                  <Field type="number" name='amount' className="form-input" required />
                  <label className="form-label" htmlFor="amount">Amount</label>
                  <ErrorMessage name='amount' >
                    {msg => <div className="text-danger">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Description field */}
                <div className="form-input-field mb-4">
                  <Field type="text" name='description' className="form-input" required />
                  <label className="form-label" htmlFor="description">Description</label>
                </div>

                {/* Submit button  */}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary btn-block mb-4 me-2"
                    disabled={isSubmitting}>
                    {(edit) ? 'Update' : 'Add'}
                  </button>
                  <button type="button" className="btn btn-danger btn-block mb-4 ms-2"
                    onClick={() => {
                      navigateTo('/dash/expense')
                    }}
                    disabled={isSubmitting}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )
      }
    </Formik >


  )
}

export default ExpenseForm