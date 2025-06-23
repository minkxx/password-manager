import { useState } from "react"
import { Shield, Mail, Lock, ArrowLeft } from "lucide-react"
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [otp, setOtp] = useState("")

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-reset-otp`, {email})
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while sending OTP')
        }
        setStep(2)
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match")
                return
            }
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {email, newPassword, otp})
            toast.success(data.message)
            navigate('/login')
            setNewPassword("")
            setConfirmPassword("")
            setOtp("")
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while resetting password')
        }
    }

    const handleBack = () => {
        setStep(1)
        setNewPassword("")
        setConfirmPassword("")
        setOtp("")
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600 text-sm">
                        {step === 1 ? "Enter your email to receive a verification code" : "Enter the code and your new password"}
                    </p>
                </div>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-50 p-4 rounded-full">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Send Verification Code
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Password + OTP Input */}
                {step === 2 && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-50 p-4 rounded-full">
                                <Lock className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg mb-6">
                            <p className="text-green-800 text-sm text-center">
                                Verification code sent to <span className="font-semibold">{email}</span>
                            </p>
                        </div>

                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Reset Password
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Email
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
