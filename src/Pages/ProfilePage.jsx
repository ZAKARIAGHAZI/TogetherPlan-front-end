import { useState } from "react";
import { useSelector } from "react-redux";
import {
    User,
    Mail,
    Calendar,
    Shield,
    Lock,
    Bell,
    Eye,
    EyeOff,
    Save,
    Camera,
    Edit2,
    CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        eventReminders: true,
        weeklyDigest: false,
        marketingEmails: false,
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePreferenceChange = (key) => {
        setPreferences({
            ...preferences,
            [key]: !preferences[key],
        });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const response = await api.put(`/users/${user.id}`, {
                name: formData.name,
                email: formData.email,
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, {
                current_password: passwordData.currentPassword,
                password: passwordData.newPassword,
                password_confirmation: passwordData.confirmPassword,
            });
            toast.success("Password updated successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Error changing password");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = () => {
        // TODO: Dispatch update preferences action
        console.log("Saving preferences:", preferences);
        toast.success("Preferences saved");
    };

    const tabs = [
        { id: "personal", label: "Personal Information", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "preferences", label: "Preferences", icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="px-4 md:px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="relative group self-center sm:self-auto">
                                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <button className="absolute bottom-2 right-2 h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors border border-gray-200">
                                    <Camera size={18} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 pt-4 sm:pt-0 w-full text-center sm:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user?.name || "User"}</h1>
                                <p className="text-gray-500 mt-1">{user?.email || "email@example.com"}</p>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        <CheckCircle2 size={14} className="mr-1" />
                                        Verified Account
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 capitalize">
                                        {user?.role || "Member"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {activeTab === "personal" && (
                                <button
                                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                    className="mt-4 sm:mt-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
                                >
                                    {isEditing ? (
                                        <>
                                            <Save size={18} />
                                            Save
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 size={18} />
                                            Edit
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 bg-white px-4 md:px-6 rounded-t-2xl pt-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsEditing(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm p-8">
                    {/* Personal Information Tab */}
                    {activeTab === "personal" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    icon={User}
                                    disabled={!isEditing}
                                />
                                <InputField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    icon={Mail}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={16} />
                                        <span>Member since: {new Date(user?.created_at || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Ensure your password is at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-4">
                                <PasswordField
                                    label="Current Password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    show={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                />
                                <PasswordField
                                    label="New Password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    show={showNewPassword}
                                    onToggle={() => setShowNewPassword(!showNewPassword)}
                                />
                                <PasswordField
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    show={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>

                            <button
                                onClick={handleSavePassword}
                                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Lock size={18} />
                                Update Password
                            </button>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Manage how you want to be notified
                                </p>
                            </div>

                            <div className="space-y-4">
                                <PreferenceToggle
                                    label="Email Notifications"
                                    description="Receive emails for important events"
                                    checked={preferences.emailNotifications}
                                    onChange={() => handlePreferenceChange("emailNotifications")}
                                />
                                <PreferenceToggle
                                    label="Event Reminders"
                                    description="Receive reminders before your events"
                                    checked={preferences.eventReminders}
                                    onChange={() => handlePreferenceChange("eventReminders")}
                                />
                                <PreferenceToggle
                                    label="Weekly Digest"
                                    description="Receive a summary of your activities each week"
                                    checked={preferences.weeklyDigest}
                                    onChange={() => handlePreferenceChange("weeklyDigest")}
                                />
                                <PreferenceToggle
                                    label="Marketing Emails"
                                    description="Receive news and updates about our products"
                                    checked={preferences.marketingEmails}
                                    onChange={() => handlePreferenceChange("marketingEmails")}
                                />
                            </div>

                            <button
                                onClick={handleSavePreferences}
                                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Save size={18} />
                                Save Preferences
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Components
function InputField({ label, icon: Icon, disabled, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={18} />
                </div>
                <input
                    {...props}
                    disabled={disabled}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${disabled ? "bg-gray-50 text-gray-500" : ""
                        }`}
                />
            </div>
        </div>
    );
}

function PasswordField({ label, show, onToggle, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                </div>
                <input
                    {...props}
                    type={show ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

function PreferenceToggle({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

export default ProfilePage;
