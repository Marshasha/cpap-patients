import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {BrowserRouter} from 'react-router-dom';
import {Route, Routes} from "react-router";

import Navigation from "./views/Navigation";
import LoginPage from "./views/LoginPage";
import SignUp from "./views/SignUp";
import FileUpload from "./views/FileUpload";
import Profile from "./views/Profile";
import Home from "./views/Home";
import UsageTime from "./views/UsageTime";
import DoctorsBoard from "./views/DoctorsBoard";
import UserGuide from "./views/UserGuide";
import DoctorsGuide from "./components/DoctorsGuide";
import PatientsGuide from "./components/PatientsGuide";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Navigation/>}>
                <Route index element={<Home/>}/>
                <Route exact path='/login' element={<LoginPage/>}/>
                <Route exact path='/signup' element={<SignUp />} />
                <Route path='/fileUpload' element={<FileUpload/>}/>
                <Route exact path='/profile' element={<Profile />} />
                <Route path='/usageTime' element={<UsageTime/>} />
                <Route path='/doctorsBoard' element={<DoctorsBoard/>}/>
                <Route path='/info' element={<UserGuide/>}/>
                <Route path='/infoDoctor' element={<DoctorsGuide/>}/>
                <Route path='/infoPatient' element={<PatientsGuide/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
