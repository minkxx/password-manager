import React, {useContext} from 'react';
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate()
    const {backend_url, isLoggedIn, setIsLoggedIn, userData } = useContext(AppContext);

    const handleLogout = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;

        try {
            const res = await axios.get(`${backend_url}/api/auth/logout`);
            if (res.status === 200) {
                toast.success('Logged out successfully');
                setIsLoggedIn(false);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while logging out');
        }
    }

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        try{
            const {data} = await axios.get(`${backend_url}/api/auth/send-verify-otp`);
            toast.success(data.message);
            navigate('/email-verify');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while sending otp');
        }
    }

    return (
        <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
            <div className="flex items-center gap-4">
                <img src={assets.icon} alt="" className="w-12 sm:w-14"/>
                <h1 className="text-2xl sm:text-3xl font-semibold">PassOP</h1>
            </div>
            {isLoggedIn ? (
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white cursor-pointer relative group">
                    <span className="text-2xl">{userData && userData.name[0].toUpperCase()}</span>
                    <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-md pt-12">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-sm w-30 shadow-lg rounded-md">
                            {userData.isVerified || <li onClick={async (e)=>{await handleVerifyEmail(e)}} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
                            <li onClick={handleLogout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                </div>

            ) : (
                <button onClick={() => {
                    navigate("/login")
                }}
                        className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login
                </button>
            )}

        </div>
    );
};

export default Navbar;