import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut, faHome, faUser, faBars, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { logOut } from './auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const logout = (navigateTo, dispatch) => {
    dispatch(logOut())
    localStorage.clear('accessToken')
    navigateTo('/login')
}

const DashHeader = () => {

    const [navToggle, setNavToggle] = useState(false)

    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : {};
    const name = decodedToken.user.name;

    const navigateTo = useNavigate()

    const dispatch = useDispatch()

    const navLinks = []

    const component = (
        <header className='dash-header'>
            <nav>
                <div id='title-container'>
                    <h4 id='title'>Pettycash Manager</h4>
                </div>
                <div id='nav-link' className={navToggle ? 'active' : 'inActive'}>
                    <div className='toggle-button'>
                        <FontAwesomeIcon icon={faMultiply} onClick={() => setNavToggle(false)} />
                    </div>
                    <div className='menu-items'>
                        <button className='menu-buttons'>
                            <FontAwesomeIcon className='icon-buttons' icon={faUser} />
                            <div id='name' className='menu-text'>{name}</div>
                        </button>
                    </div>
                    <div className='menu-items'>
                        <button className='menu-buttons' onClick={() => navigateTo('/dash')} >
                            <FontAwesomeIcon className='icon-buttons' icon={faHome} />
                            <div id="home" className='menu-text'>Home</div>
                        </button>
                    </div>
                    <div className="menu-items">
                        <button className='menu-buttons' onClick={() => logout(navigateTo, dispatch)} >
                            <FontAwesomeIcon className='icon-buttons' icon={faSignOut} />
                            <div id="menu-text">Logout</div>
                        </button>
                    </div>
                </div>
                <div id="mobile">
                    <FontAwesomeIcon icon={faBars} onClick={() => setNavToggle(true)} />
                </div>
            </nav>
        </header>
    )

    return component
}

export default DashHeader