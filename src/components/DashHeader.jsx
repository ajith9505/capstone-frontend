import React from 'react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut, faHome } from '@fortawesome/free-solid-svg-icons'
import { logOut } from './auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const logout = (navigateTo, dispatch) => {
    dispatch(logOut())
    localStorage.clear('accessToken')
    navigateTo('/login')
}

const DashHeader = () => {

    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : {};
    const name = decodedToken.user.name;

    const navigateTo = useNavigate()

    const dispatch = useDispatch()

    return (
        <header className='dash-header d-flex'>
            <div className='title-container d-flex align-items-center'>
            <button className='icon-button border-0 me-4 btn-outline ms-2 pb-2' style={{backgroundColor: '#ffb6b9'}} onClick={() => navigateTo('/dash')} >
                    <FontAwesomeIcon icon={faHome} />
                </button>
                <h4 className='title'>Pettycash Manager</h4>
            </div>
            <div className='icon-container d-flex justify-content-end pe-5'>
                <h5 className='me-3 pt-3'>{name}</h5>
                <button className='icon-button' onClick={() => logout(navigateTo, dispatch)} >
                    <FontAwesomeIcon icon={faSignOut} />
                </button>
            </div>
        </header>
    )
}

export default DashHeader