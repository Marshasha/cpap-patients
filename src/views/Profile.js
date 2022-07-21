import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import "./Views.css"
import {useTranslation} from "react-i18next";

export default function Profile() {
    const { user: currentUser } = useSelector(state => state.auth)
    const { t } = useTranslation();

    if (!currentUser) {
        return <Navigate to='/login' />
    }

    return (
        <div className='container'>
            <header className='jumbotron'>
                <label className="mx-3">
                    <strong>{currentUser.user.username}</strong>{t('hello')}
                </label>
            </header>

            <p className="steps">
                <strong>Id:</strong> {currentUser.user._id}
            </p>
            <p className="steps">
                <strong>Email:</strong> {currentUser.user.email}
            </p>
            <strong>Authorities:</strong>
            <ul>{currentUser.user.role }</ul>
        </div>
    )
}
