import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import './Auth.css'
import axios from '../../api/axios'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'

// Validation Schema using yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at lease 8 characters.')
    .required('Required'),
});

const Login = () => {

const [isloading, setIsLoading] = useState(false)

  const navigateTo = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {

    try {
      setIsLoading(true)
      const response = await axios.post('/auth/login',
        JSON.stringify({ ...values }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      const accessToken = response.data.accessToken;
      dispatch(setCredentials({ ...values, accessToken }));
      setIsLoading(false)
      navigateTo('/dash')

    } catch (err) {
      setIsLoading(false)
      setSubmitting(false);
      setFieldError(err.response.data.message == 'User not found' ? 'email' : 'password', err.response.data.message);
    }
  }

  // if (isloading) return <p>Loading...</p>

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting, setFieldError }) => handleSubmit(values, { setSubmitting, setFieldError })}>

      {({ isSubmitting }) => (
        <Form>
          <div className='wrapper'>
            <div className='container main'>
              <div className="input-box">
                <header>Login Account</header>

                {/* email input field */}
                <div className="input-field">
                  <Field type="text" className="input" id="email" name="email" required autoComplete='off'/>
                  <label htmlFor="email">Email</label>
                  <ErrorMessage name='email'>
                    {msg => <div className="text-danger mb-2" style={{ fontSize: '13px' }}>{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* password input field */}
                <div className="input-field">
                  <Field type="password" className="input" id="password" name="password" required/>
                  <label htmlFor="password">Password</label>
                  <ErrorMessage name='password'>
                    {msg => <div className="text-danger mb-2" style={{ fontSize: '13px' }}>{msg}</div>}
                  </ErrorMessage>
                </div>
                <div className="input-field">
                  <input type="submit" disabled={isSubmitting} className="submit" value="Login" />
                </div>
                <div className="link">
                  <span>New user? <Link to="/register">Register here</Link></span>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}

    </Formik>

  )
}

export default Login