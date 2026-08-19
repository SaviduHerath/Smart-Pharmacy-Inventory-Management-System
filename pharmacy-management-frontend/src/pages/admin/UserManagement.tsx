import { useEffect, useState } from "react";
import {
    getAllUsers,
    createStaffUser,
    updateUserRole,
    deleteUser,
    type AdminUser,
} from "../../services/adminUserService";

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
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white">

                <div className="flex h-20 items-center border-b border-slate-800 px-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl">
                        💊
                    </div>

                    <div className="ml-3">

                        <h1 className="font-bold">
                            Smart Pharmacy
                        </h1>

                        <p className="text-xs text-slate-400">
                            Admin Panel
                        </p>

                    </div>

                </div>


                <nav className="mt-6 px-3">

                    <a
                        href="/admin"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        ▦ <span className="ml-3">Dashboard</span>
                    </a>

                    <a
                        href="/admin/users"
                        className="flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium"
                    >
                        👥 <span className="ml-3">Users</span>
                    </a>

                </nav>

            </aside>


            {/* Main */}
            <main className="ml-64">

                {/* Navbar */}
                <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

                    <div className="flex h-full items-center justify-between px-8">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                User Management
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage administrators and pharmacists
                            </p>

                        </div>


                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                            + Add Staff
                        </button>

                    </div>

                </header>


                <div className="pt-20">

                    <div className="p-8">
                        {success && (
                            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Users table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h3 className="font-bold text-slate-800">
                                    All Users
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {users.length} registered users
                                </p>

                            </div>


                            {loading ? (

                                <div className="p-10 text-center text-sm text-slate-500">
                                    Loading users...
                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-slate-50">

                                            <tr>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    User
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Email
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Role
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {users.map((user) => (

                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                                                {user.fullName
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <span className="font-medium text-slate-800">
                                                                {user.fullName}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {user.email}
                                                    </td>


                                                    
                                                    <td className="px-6 py-4">

                                                        <select
                                                        
                                                            value={user.role}
                                                            disabled={
                                                                actionLoading === user.id ||
                                                                currentUser?.id === user.id
                                                            }
                                                            onChange={(e) =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    e.target.value as
                                                                        | "ADMIN"
                                                                        | "PHARMACIST"
                                                                        | "CUSTOMER"
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                                                        >
                                                            <option value="ADMIN">
                                                                ADMIN
                                                            </option>

                                                            <option value="PHARMACIST">
                                                                PHARMACIST
                                                            </option>

                                                            <option value="CUSTOMER">
                                                                CUSTOMER
                                                            </option>
                                                        </select>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <button
                                                            disabled={
                                                                actionLoading === user.id ||
                                                                currentUser?.id === user.id
                                                            }
                                                            onClick={() =>
                                                                handleDeleteUser(user.id)
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h3 className="text-lg font-bold text-slate-800">
                                    Add Staff User
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Create an admin or pharmacist
                                </p>

                            </div>


                            <button
                                onClick={() => setShowModal(false)}
                                className="text-xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 p-6"
                        >

                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    required
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            fullName: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                    placeholder="Enter full name"
                                />

                            </div>


                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                    placeholder="Enter email"
                                />

                            </div>


                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <input
                                    required
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                    placeholder="Enter password"
                                />

                            </div>


                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Role
                                </label>

                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value as
                                                | "ADMIN"
                                                | "PHARMACIST",
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                                >

                                    <option value="PHARMACIST">
                                        PHARMACIST
                                    </option>

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                </select>

                            </div>


                            <div className="flex gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
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

