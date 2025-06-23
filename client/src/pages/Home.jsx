import React, {useContext, useEffect} from 'react';
import Navbar from "../components/Navbar.jsx";
import {AppContext} from "../context/AppContext.jsx";
import PasswordManager from "../components/PasswordManager.jsx";
import LandingPage from "../components/LandingPage.jsx";

const Home = () => {
    const { userData, getPasswords, userPasswords, isAddingPassword,isDeletingPassword } = useContext(AppContext);

    useEffect(() => {
        getPasswords();
    }, [userData, isAddingPassword, isDeletingPassword]);

    return (
        <div>
            <Navbar/>
            {userData ? <PasswordManager passwords={userPasswords}/> : <LandingPage/>}
        </div>
    );
};

export default Home;