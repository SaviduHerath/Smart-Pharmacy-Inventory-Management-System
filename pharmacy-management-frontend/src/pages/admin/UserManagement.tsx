import { useEffect, useState } from "react";
import {
    getAllUsers,
    createStaffUser,
    updateUserRole,
    deleteUser,
    type AdminUser,
} from "../../services/adminUserService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import { useAuth } from "../../context/AuthContext";

export default function UserManagement() {

    const [users, setUsers] = useState<AdminUser[]>([]);

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "PHARMACIST" as "ADMIN" | "PHARMACIST",
    });

    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [success, setSuccess] = useState("");

    const { user: currentUser } = useAuth();

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllUsers();

            setUsers(data);

        } catch (err) {

            console.error(err);

            setError("Failed to load users.");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadUsers();
    }, []);


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setError("");

            await createStaffUser(form);

            setShowModal(false);

            setForm({
                fullName: "",
                email: "",
                password: "",
                role: "PHARMACIST",
            });

            await loadUsers();

        } catch (err: any) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create user."
            );
        }
    };

        
       const handleRoleChange = async (
    id: number,
    role: "ADMIN" | "PHARMACIST" | "CUSTOMER"
) => {

    try {

        setError("");
        setSuccess("");
        setActionLoading(id);

        await updateUserRole(id, role);

        setSuccess("User role updated successfully.");

        await loadUsers();

    } catch (err: any) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Failed to update user role."
        );

    } finally {

        setActionLoading(null);
    }
};

        const handleDeleteUser = async (
            id: number
        ) => {

            const confirmed = window.confirm(
                "Are you sure you want to delete this user?"
            );

            if (!confirmed) {
                return;
            }

            try {

                setError("");

                await deleteUser(id);

                await loadUsers();

            } catch (err: any) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to delete user."
                );
            }
        };




    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 flex relative">
            {/* Immersive background image with heavy dark overlay */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity" 
                style={{ backgroundImage: "url('/bg-admin.jpg')" }} 
            />
            <div className="fixed inset-0 z-0 bg-slate-950/80 backdrop-blur-sm" />

            <AdminSidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden z-10">
                <AdminNavbar />

                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

                <div className="flex-1 p-10 pt-32 relative z-10 overflow-auto">
                    <div className="max-w-7xl mx-auto anim-page">
                        
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                                <p className="mt-2 text-sm font-medium text-slate-400">
                                    Manage administrators and pharmacists
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Staff
                            </button>
                        </div>

                        {success && (
                            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        {/* Users table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-md shadow-xl shadow-black/10">
                            <div className="border-b border-slate-700/50 px-6 py-5 bg-slate-800/80">
                                <h3 className="font-bold text-white tracking-wide">
                                    All Users
                                </h3>
                                <p className="mt-1 text-sm font-medium text-emerald-400/80">
                                    {users.length} registered users
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center p-20 text-emerald-400">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                                    <p className="mt-4 text-sm font-medium">Loading users...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-900/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {users.map((user) => (
                                                <tr key={user.id} className="transition-colors hover:bg-slate-700/30">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-inner font-bold text-emerald-400">
                                                                {user.fullName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-slate-200">
                                                                {user.fullName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={user.role}
                                                            disabled={actionLoading === user.id || currentUser?.id === user.id}
                                                            onChange={(e) =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    e.target.value as "ADMIN" | "PHARMACIST" | "CUSTOMER"
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none custom-select-icon"
                                                        >
                                                            <option value="ADMIN">ADMIN</option>
                                                            <option value="PHARMACIST">PHARMACIST</option>
                                                            <option value="CUSTOMER">CUSTOMER</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            disabled={actionLoading === user.id || currentUser?.id === user.id}
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 anim-page">
                    <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Add Staff User</h3>
                                <p className="text-xs font-medium text-emerald-400 mt-1 uppercase tracking-widest">Create an admin or pharmacist</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                                <input
                                    required
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Enter email"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                                <input
                                    required
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "PHARMACIST" })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-200 outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500 appearance-none custom-select-icon"
                                >
                                    <option value="PHARMACIST">PHARMACIST</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-xl border border-slate-600 bg-transparent px-4 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

