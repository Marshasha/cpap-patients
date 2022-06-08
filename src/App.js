import './App.css';
import React from "react";
import {BrowserRouter} from 'react-router-dom';
import {Route, Routes} from "react-router";

import Navigation from "./views/Navigation";
import LoginPage from "./views/LoginPage";
import SignUp from "./views/SignUp";
import FileUpload from "./views/FileUpload";
import Profile from "./views/Profile";
import Home from "./views/Home";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Navigation/>}>
                <Route index element={<Home/>}/>
                <Route exact path='/login' element={<LoginPage/>}/>
                <Route exact path='/sign-up' element={<SignUp />} />
                <Route path='/fileUpload' element={<FileUpload/>}/>
                <Route exact path='/profile' element={<Profile />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
