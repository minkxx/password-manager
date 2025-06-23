import React, {useContext, useState} from 'react';
import {AppContext} from "../../context/AppContext.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const Login = () => {
    const {backend_url, isLoggedIn, setIsLoggedIn, getUserData} = useContext(AppContext);
    const navigate = useNavigate();

    const [state, setState] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;

        if (state === "Sign Up") {
            try {
                const res = await axios.post(`${backend_url}/api/auth/register`, {
                    name,
                    email,
                    password
                });
                if (res.status === 200) {
                    toast.success("User registered successfully");
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred during registration");
                }
            }
        } else {
            try {
                const res = await axios.post(`${backend_url}/api/auth/login`, {
                    email,
                    password
                });
                if (res.status === 200) {
                    toast.success("Login successful");
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/');
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred during login");
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {state === "Sign Up" ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-600">{state === "Sign Up" ? "Sign up to get started" : "Sign in to your account"}</p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    {state === "Sign Up" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                    </div>

                    {state === "Sign In" && (
                        <p className="text-xs text-blue-700 hover:underline cursor-pointer" onClick={()=>{navigate("/reset-password")}}>Forget password?</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {state}
                    </button>
                </form>

                {/* Toggle between Sign Up and Sign In */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {state === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
                        <button
                            type="button"
                            onClick={() => setState(state === "Sign Up" ? "Sign In" : "Sign Up")}
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer"
                        >
                            {state === "Sign Up" ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;