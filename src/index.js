import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import './services/i18n'

const container = document.getElementById('root')
const root = createRoot(container)

// eslint-disable-next-line jest/require-hook
root.render(
    <Provider store={store}>
        <App />
    </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line jest/require-hook
reportWebVitals()
