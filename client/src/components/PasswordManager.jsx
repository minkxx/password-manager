import {useContext} from "react"
import {
    Search,
    Plus,
    Eye,
    EyeOff,
    Copy,
    Edit,
    Trash2,
    Globe,
    User,
    Lock,
    Check,
    X,
} from "lucide-react"
import axios from "axios";
import {toast} from "react-toastify";
import {AppContext} from "../context/AppContext.jsx";

export default function PasswordManager({passwords = []}) {
    const {
        searchTerm, setSearchTerm,
        showPasswords, setShowPasswords,
        isAddingPassword, setIsAddingPassword,
        editingPassword, setEditingPassword,
        copiedId, setCopiedId,
        newPassword, setNewPassword,
        isDeletingPassword, setIsDeletingPassword
    } = useContext(AppContext);

    const filteredPasswords = passwords.filter(
        (password) =>
            password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
            password.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const togglePasswordVisibility = (id) => {
        setShowPasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
        let password = ""
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setNewPassword((prev) => ({...prev, password}))
    }

    const handleAddPassword = async () => {
        axios.defaults.withCredentials = true;
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/password/add-password`, newPassword)
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong!";
            toast.error(message);
        }
        setNewPassword({website: "", username: "", password: ""})
        setIsAddingPassword(false)
    }

    const handleDeletePassword = async (id) => {
        setIsDeletingPassword(true);
        axios.defaults.withCredentials = true;
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/password/delete-password`, {password_id:id})
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong!";
            toast.error(message);
        }
        setIsDeletingPassword(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-36">
                {/* Top Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Passwords</h1>
                            <p className="text-gray-600 mt-1">
                                {passwords.length} password{passwords.length !== 1 ? "s" : ""} stored securely
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddingPassword(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2"/>
                            Add Password
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                        <input
                            type="text"
                            placeholder="Search passwords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Add Password Modal */}
                {isAddingPassword && (
                    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Add New Password</h2>
                                <button onClick={() => setIsAddingPassword(false)}
                                        className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6"/>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    <input
                                        type="text"
                                        placeholder="example.com"
                                        value={newPassword.website}
                                        onChange={(e) => setNewPassword((prev) => ({...prev, website: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        placeholder="your@email.com"
                                        value={newPassword.username}
                                        onChange={(e) => setNewPassword((prev) => ({
                                            ...prev,
                                            username: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter or generate password"
                                            value={newPassword.password}
                                            onChange={(e) => setNewPassword((prev) => ({
                                                ...prev,
                                                password: e.target.value
                                            }))}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={generatePassword}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsAddingPassword(false);
                                        setNewPassword({website: "", username: "", password: ""});
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPassword}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password List */}
                {filteredPasswords.length === 0 ? (
                    <div className="text-center py-16">
                        <div
                            className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Lock className="h-12 w-12 text-gray-400"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? "No passwords found" : "No passwords yet"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Add your first password to get started securing your accounts"}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setIsAddingPassword(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Add Your First Password
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPasswords.map((password) => (
                            <div
                                key={password._id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Website Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div
                                            className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">

                                            <Globe className="h-5 w-5 text-blue-600"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 truncate">{password.website}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setEditingPassword(password._id)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-4 w-4"/>
                                        </button>
                                        <button
                                            onClick={async () =>await handleDeletePassword(password._id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="h-4 w-4 mr-2"/>
                                            <span className="truncate">{password.username}</span>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(password.username, `${password._id}-username`)}
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {copiedId === `${password._id}-username` ? (
                                                <Check className="h-4 w-4 text-green-600"/>
                                            ) : (
                                                <Copy className="h-4 w-4"/>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Lock className="h-4 w-4 mr-2"/>
                                            <span className="font-mono">
                        {showPasswords[password._id] ? password.password : "•".repeat(password.password.length)}
                      </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => togglePasswordVisibility(password._id)}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                {showPasswords[password._id] ? <EyeOff className="h-4 w-4"/> :
                                                    <Eye className="h-4 w-4"/>}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(password.password, `${password._id}-password`)}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                {copiedId === `${password._id}-password` ? (
                                                    <Check className="h-4 w-4 text-green-600"/>
                                                ) : (
                                                    <Copy className="h-4 w-4"/>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(password.username, `${password._id}-username`)}
                                        className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Copy Username
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(password.password, `${password._id}-password`)}
                                        className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        Copy Password
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
