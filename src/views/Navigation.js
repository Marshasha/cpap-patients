import {Link, Outlet} from "react-router-dom";
import {Fragment, useEffect, useState} from 'react';
import logo from "../images/Logo-LL-dt-fr-it.jpg";
import './Views.css';
import React from "react";
import {useDispatch, useSelector} from "react-redux";

import { logout } from '../actions/auth'
import { clearMessage } from '../actions/message'
import { history } from '../helpers/history'

function Navigation(){

    const [showDoctorBoard, setShowDoctorBoard] = useState(false)
    const [showAdminBoard, setShowAdminBoard] = useState(false)
    const { user: currentUser } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        history.listen(() => {
            dispatch(clearMessage()) // clear message when changing location
        })
    }, [dispatch])

    useEffect(() => {
        if (currentUser) {
            setShowDoctorBoard(currentUser.roles.includes('ROLE_DOCTOR'))
            setShowAdminBoard(currentUser.roles.includes('ROLE_ADMIN'))
        }
    }, [currentUser])

    const logOut = () => {
        dispatch(logout())
    }

    return (
        <Fragment>
            <div className='navigation'>
                <div className='links-container'>
                    <Link to={'/'} className='logo-container'>
                        <img src={logo} className='logo' alt="logo"/>
                    </Link>
                    <div className='navbar-nav mr-auto'>
                        <li className='nav-item'>
                            <Link to={'/fileUpload'} className='nav-link'>
                                Upload EDF file
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
                                <Link to={'/doctor'} className='nav-link'>
                                    Doctor Board
                                </Link>
                            </li>
                        )}
                        {currentUser && (
                            <li className='nav-item'>
                                <Link to={'/user'} className='nav-link'>
                                    User
                                </Link>
                            </li>
                        )}
                        {currentUser ? (
                            <div className='navbar-nav ml-auto'>
                                <li className='nav-item'>
                                    <Link to={'/profile'} className='nav-link'>
                                        {currentUser.username}
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
                                        Login
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to={'/sign-up'} className='nav-link'>
                                        Sign Up
                                    </Link>
                                </li>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Outlet/>
        </Fragment>
    );
}

export default Navigation;