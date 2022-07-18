import {Link, Outlet} from "react-router-dom";
import {Fragment, useEffect, useState} from 'react';
import './Views.css';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import '../services/i18n'

import { logout } from '../actions/auth'
import { clearMessage } from '../actions/message'
import { history } from '../helpers/history'




const lngs = {
    FR : { nativeName: 'FR' },
    EN : { nativeName: 'EN' },
    DE: { nativeName: 'DE' },
    IT: { nativeName: 'IT' },
}


function Navigation(){

    const [showDoctorBoard, setShowDoctorBoard] = useState(false)
    const [showAdminBoard, setShowAdminBoard] = useState(false)
    const { user: currentUser } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()



    useEffect(() => {
        history.listen(() => {
            dispatch(clearMessage()) // clear message when changing location
        })
    }, [dispatch])

    useEffect(() => {

        if (currentUser) {
            console.log("Current user " + currentUser.user.role + " Token " + currentUser.token)
            setShowDoctorBoard(currentUser.user.role.includes('ROLE_DOCTOR'))
            setShowAdminBoard(currentUser.user.role.includes('ROLE_ADMIN'))
        }
    }, [currentUser])

    const logOut = () => {
        dispatch(logout())
    }

    return (
        <Fragment>
            <div className='navigation'>
                <nav className='navbar navbar-expand navbar-nav bg-transparent'>
                    <div className='navbar-nav mr-auto'>

                            <li className="nav-item">
                                {Object.keys(lngs).map((lng) => (
                                    <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                                        {lngs[lng].nativeName}
                                    </button>
                                ))}
                            </li>
                            <li className='nav-item'>
                                <Link to={'/info'} className='nav-link'>
                                    {t('infoBoard')}
                                </Link>
                            </li>

                        {showAdminBoard && (
                            <li className='nav-item'>
                                <Link to={'/admin'} className='nav-link'>
                                    Admin Board
                                </Link>
                            </li>
                        )}
                        {showDoctorBoard && (
                            <li className='nav-item'>
                                <Link to={'/doctorsBoard'} className='nav-link'>
                                    {t('patients')}
                                </Link>
                            </li>
                        )}
                        {currentUser && (
                            <li className='nav-item'>
                                <Link to={'/fileUpload'} className='nav-link'>
                                    {t('fileUpload')}
                                </Link>
                            </li>

                        )}
                        {currentUser ? (
                            <div className='navbar-nav ml-auto'>
                                <li className='nav-item'>
                                    <Link to={'/usageTime'} className='nav-link' >
                                        {t('usageTime')}
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to={'/profile'} className='nav-link'>
                                        {currentUser.user.username}
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <a href='/login' className='nav-link' onClick={logOut}>
                                        Log Out
                                    </a>
                                </li>
                            </div>
                        ) : (
                            <div className='navbar-nav ml-auto'>
                                <li className='nav-item'>
                                    <Link to={'/login'} className='nav-link'>
                                        {t('login')}
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to={'/signup'} className='nav-link'>
                                        {t('signup')}
                                    </Link>
                                </li>

                            </div>
                        )}
                </div>
                </nav>
            </div>
            <Outlet/>
        </Fragment>
    );
}

export default Navigation;