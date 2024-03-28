import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from '../../api/axios'
import './Auth.css'

const registerUrl = '/auth/register';

//Validation Schema using yup
const RegistrationSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at lease 8 characters.')
        .required('Password is required'),
});

const Register = () => {
    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {

        try {
            const response = await axios.post(
                registerUrl,
                JSON.stringify({ ...values }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // Assuming successful registration if no errors
            navigateTo('/login');

            // Handle response data here
            setSubmitting(false);

        } catch (error) {
            setFieldError('email', error.response.data.message);
            setSubmitting(false);
        }
    };

    const navigateTo = useNavigate();
    return (

        <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={RegistrationSchema}
            onSubmit={handleSubmit}
        >

            {({ isSubmitting }) => (
                <Form>
                    <div className='wrapper'>
                        <div className='container main'>
                            <div className="input-box">
                                <header>Create account</header>

                                {/* name input field */}
                                <div className="input-field">
                                    <Field type="text" className="input" name="username" id="username" required autoComplete='off' />
                                    <label htmlFor="username">Name</label>
                                    <ErrorMessage name='username'>
                                        {msg => <div className="text-danger mb-2" style={{ fontSize: '13px' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                {/* email input field */}
                                <div className="input-field">
                                    <Field type="email" className="input" name="email" id="email" required autoComplete='off' />
                                    <label htmlFor="email">Email</label>
                                    <ErrorMessage name='email'>
                                        {msg => <div className="text-danger mb-2" style={{ fontSize: '13px' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                {/* password input field */}
                                <div className="input-field">
                                    <Field type="password" className="input" name="password" id="password" required />
                                    <label htmlFor="password">Password</label>
                                    <ErrorMessage name='password'>
                                        {msg => <div className="text-danger mb-2" style={{ fontSize: '13px' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                {/* submit button */}
                                <div className="input-field">
                                    <Field type="submit" className="submit" disabled={isSubmitting} value="Signup" />
                                </div>
                                <div className="link">
                                    <span>Already have an account? <Link className='text-primary' to={'/login'}>Login here</Link></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}

        </Formik>
    )
}

export default Register