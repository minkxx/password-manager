import {createContext, useEffect, useState} from 'react';
import axios from "axios";
import {toast} from "react-toastify";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

export const AppContext = createContext();

export const AppProvider = (props) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [userPasswords, setUserPasswords] = useState([]);

    const [searchTerm, setSearchTerm] = useState("")
    const [showPasswords, setShowPasswords] = useState({})
    const [isAddingPassword, setIsAddingPassword] = useState(false)
    const [isDeletingPassword, setIsDeletingPassword] = useState(false)
    const [editingPassword, setEditingPassword] = useState(null)
    const [copiedId, setCopiedId] = useState(null)
    const [newPassword, setNewPassword] = useState({
        website: "",
        username: "",
        password: "",
    })

    const getPasswords = async () => {
        axios.defaults.withCredentials = true;
        try {
            const {data} = await axios.get(`${backend_url}/api/password/get-all-passwords`);
            if (data) {
                setUserPasswords(data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getAuthState = async () => {
        axios.defaults.withCredentials = true;
        try {
            const {data} = await axios.get(`${backend_url}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData()
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getUserData = async () => {
        axios.defaults.withCredentials = true;
        try {
            const {data} = await axios.get(`${backend_url}/api/user`);
            if (data) {
                setUserData(data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backend_url,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        userPasswords,
        setUserPasswords,
        getPasswords,
        searchTerm,
        setSearchTerm,
        showPasswords,
        setShowPasswords,
        isAddingPassword,
        setIsAddingPassword,
        editingPassword,
        setEditingPassword,
        copiedId,
        setCopiedId,
        newPassword,
        setNewPassword,
        isDeletingPassword, setIsDeletingPassword
    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}