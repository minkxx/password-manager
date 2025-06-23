import { useState, useRef } from "react"
import { Shield, Mail } from "lucide-react"
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const EmailVerify = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef([])

    const handleChange = (index, value) => {
        if (value.length > 1) return
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.defaults.withCredentials = true;
        const otpString = otp.join("")
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`, {otp: otpString})
            toast.success(data.message);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while verifying your email')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                            <Shield className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600 text-sm">Enter the 6-digit code sent to your email</p>
                </div>

                {/* Email Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 p-4 rounded-full">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter verification code</label>
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Verify Email
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EmailVerify
