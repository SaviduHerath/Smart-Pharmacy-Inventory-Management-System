import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {

    const [showPassword, setShowPassword] = useState(false);


    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");

        if (!fullName || !email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        try {

            setLoading(true);

            await registerUser({
                fullName,
                email,
                password,
            });

            navigate("/login");

        } catch (error: any) {

            console.error(
                "Registration error:",
                error
            );

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* =====================================================
                LEFT BRANDING
            ====================================================== */}

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 relative overflow-hidden">

                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full" />

                <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full" />

                <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">

                            <span className="text-2xl font-bold text-blue-600">
                                +
                            </span>

                        </div>

                        <div>

                            <h1 className="text-xl font-bold">
                                Smart Pharmacy
                            </h1>

                            <p className="text-sm text-blue-100">
                                Management System
                            </p>

                        </div>

                    </div>


                    {/* Main content */}
                    <div className="max-w-lg">

                        <p className="text-cyan-100 font-medium mb-4">
                            JOIN OUR PLATFORM
                        </p>

                        <h2 className="text-5xl font-bold leading-tight">
                            Your pharmacy,
                            <span className="block text-cyan-100">
                                connected.
                            </span>
                        </h2>

                        <p className="mt-6 text-blue-100 text-lg leading-relaxed">
                            Create your account and access a modern
                            pharmacy management experience.
                        </p>


                        <div className="mt-8 space-y-4">

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Easy management
                                    </p>

                                    <p className="text-sm text-blue-100">
                                        Manage medicines and orders easily.
                                    </p>
                                </div>

                            </div>


                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Secure platform
                                    </p>

                                    <p className="text-sm text-blue-100">
                                        Your account is protected with JWT.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    <p className="text-sm text-blue-100">
                        © 2026 Smart Pharmacy Management System
                    </p>

                </div>

            </div>


            {/* =====================================================
                REGISTER FORM
            ====================================================== */}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">

                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">

                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">

                            <span className="text-2xl font-bold text-white">
                                +
                            </span>

                        </div>

                        <div>

                            <h1 className="font-bold text-lg text-slate-900">
                                Smart Pharmacy
                            </h1>

                            <p className="text-xs text-slate-500">
                                Management System
                            </p>

                        </div>

                    </div>


                    {/* Heading */}
                    <div className="mb-7">

                        <p className="text-sm font-semibold text-blue-600 mb-2">
                            GET STARTED
                        </p>

                        <h2 className="text-3xl font-bold text-slate-900">
                            Create your account
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Fill in your details to get started.
                        </p>

                    </div>


                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleRegister}>

                        {/* Full Name */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full name
                            </label>

                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full px-4 pr-20 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-800"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm password
                            </label>

                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />

                        </div>


                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-1">

                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />

                            <label
                                htmlFor="terms"
                                className="text-sm text-slate-500 leading-relaxed"
                            >
                                I agree to the{" "}

                                <span className="text-blue-600 font-medium">
                                    Terms of Service
                                </span>{" "}

                                and{" "}

                                <span className="text-blue-600 font-medium">
                                    Privacy Policy
                                </span>
                            </label>

                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Register button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>



                    </form>


                    {/* Login */}
                    <p className="text-center text-sm text-slate-500 mt-7">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

