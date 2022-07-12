import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Profile() {
    const { user: currentUser } = useSelector(state => state.auth)

    if (!currentUser) {
        return <Navigate to='/login' />
    }

    return (
        <div className='container'>
            <header className='jumbotron'>
                <h3>
                    <strong>{currentUser.user.username}</strong> Profile
                </h3>
            </header>
            <p>
                <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{' '}
                {currentUser.token.substr(currentUser.token.length - 20)}
            </p>
            <p>
                <strong>Id:</strong> {currentUser.user._id}
            </p>
            <p>
                <strong>Email:</strong> {currentUser.user.email}
            </p>
            <strong>Authorities:</strong>
            <ul>{currentUser.user.role }</ul>
        </div>
    )
}
