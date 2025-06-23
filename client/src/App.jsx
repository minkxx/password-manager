import React from 'react'
import {Routes, Route} from "react-router-dom";
import { ToastContainer} from 'react-toastify';

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import EmailVerify from "./pages/auth/EmailVerify.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

const App = () => {

    return (
    <div className=''>
        <ToastContainer/>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/email-verify" element={<EmailVerify/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
        </Routes>
    </div>
  )
}

export default App
