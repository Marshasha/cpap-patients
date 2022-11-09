import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { isEmail } from 'validator'
import { register } from '../actions/auth'

const fieldRequired = value => {
    if (!value) {
        return (
            <div className='alert alert-danger' role='alert'>
                This field is required!
            </div>
        )
    }
}

const validEmail = value => {
    if (!isEmail(value)) {
        return (
            <div className='alert alert-danger' role='alert'>
                This is not a valid email.
            </div>
        )
    }
}

const validUserName = value => {
    if (value.length < 5 || value.length > 30) {
        return (
            <div className='alert alert-danger' role='alert'>
                The username must be between 5 and 30 characters.
            </div>
        )
    }
}

const validPassword = value => {
    if (value.length < 8 || value.length > 40) {
        return (
            <div className='alert alert-danger' role='alert'>
                The password must be between 8 and 40 characters.
            </div>
        )
    }
}

export default function SignUp() {
    const form = useRef()
    const checkBtn = useRef()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [successful, setSuccessful] = useState(false)
    const { message } = useSelector(state => state.message)
    const dispatch = useDispatch()

    const handleRegisterNewUser = event => {
        event.preventDefault()
        setSuccessful(false)
        form.current.validateAll()
        if (checkBtn.current.context._errors.length === 0) {
            dispatch(register(username, email, password))
                .then(() => {
                    setSuccessful(true)
                })
                .catch(() => {
                    setSuccessful(false)
                })
        }
    }

    return (
        <div className='col-md-12'>
            <div className='card card-container'>
                <img src='//ssl.gstatic.com/accounts/ui/avatar_2x.png' alt='profile-img' className='profile-img-card' />
                <Form onSubmit={handleRegisterNewUser} ref={form}>
                    {!successful && (
                        <div>
                            <div className='form-group'>
                                <label htmlFor='username'>Username</label>
                                <Input
                                    type='text'
                                    className='form-control'
                                    name='username'
                                    value={username}
                                    onChange={({ target: { value } }) => setUsername(value)}
                                    validations={[fieldRequired, validUserName]}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='email'>Email</label>
                                <Input
                                    type='text'
                                    className='form-control'
                                    name='email'
                                    value={email}
                                    onChange={({ target: { value } }) => setEmail(value)}
                                    validations={[fieldRequired, validEmail]}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Password</label>
                                <Input
                                    type='password'
                                    className='form-control'
                                    name='password'
                                    value={password}
                                    onChange={({ target: { value } }) => setPassword(value)}
                                    validations={[fieldRequired, validPassword]}
                                />
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block'>Sign Up</button>
                            </div>
                        </div>
                    )}
                    {message && (
                        <div className='form-group'>
                            <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role='alert'>
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: 'none' }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    )
}
