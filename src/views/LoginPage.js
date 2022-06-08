import React, { useState, useRef } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import {Navigate} from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../actions/auth';

const fieldRequired = value => {
    if (!value) {
        return (
            <div className='alert alert-danger' role='alert'>
                This field is required!
            </div>
        )
    }
}

export default function LoginPage(props) {

    const form = useRef();
    const checkBtn = useRef();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();

    const handleLogin = event => {
        event.preventDefault()
        setLoading(true)
        form.current.validateAll()
        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(username, password))
                .then(() => {
                    // eslint-disable-next-line react/prop-types
                    props.history.push('/profile')
                    window.location.reload()
                })
                .catch(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }

    if (isLoggedIn) {
        return <Navigate to='/profile' />
    }

  return(
      <div className='col-md-12'>
          <div className='card card-container'>
              <img src='//ssl.gstatic.com/accounts/ui/avatar_2x.png' alt='profile-img' className='profile-img-card' />
              <Form onSubmit={handleLogin} ref={form}>
                  <div className='form-group'>
                      <label htmlFor='username'>Username</label>
                      <Input
                          type='text'
                          className='form-control'
                          name='username'
                          value={username}
                          onChange={({ target: { value } }) => setUsername(value)}
                          validations={[fieldRequired]}
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
                          validations={[fieldRequired]}
                      />
                  </div>
                  <div className='form-group'>
                      <button className='btn btn-primary btn-block' disabled={loading}>
                          {loading && <span className='spinner-border spinner-border-sm'></span>}
                          <span>Login</span>
                      </button>
                  </div>
                  {message && (
                      <div className='form-group'>
                          <div className='alert alert-danger' role='alert'>
                              {message}
                          </div>
                      </div>
                  )}
                  <CheckButton style={{ display: 'none' }} ref={checkBtn} />
              </Form>
          </div>
      </div>
  );
}