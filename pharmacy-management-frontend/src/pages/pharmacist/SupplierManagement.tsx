import { useEffect, useMemo, useState } from "react";
import PharmacistLayout from "../../components/pharmacist/PharmacistLayout";
import { getApiErrorMessage } from "../../services/api";
import {
    createSupplier,
    deleteSupplier,
    getAllSuppliers,
    updateSupplier,
    type Supplier,
    type SupplierRequest,
} from "../../services/supplierService";

const emptyForm: SupplierRequest = {
    name: "",
    email: "",
    phone: "",
    address: "",
};

export default function SupplierManagement() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [form, setForm] = useState<SupplierRequest>(emptyForm);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            setError("");
            setSuppliers(await getAllSuppliers());
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load suppliers."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    const filtered = useMemo(() => {
        const keyword = search.toLowerCase();
        return suppliers.filter(
            (supplier) =>
                supplier.name.toLowerCase().includes(keyword) ||
                supplier.email?.toLowerCase().includes(keyword) ||
                supplier.phone?.includes(search)
        );
    }, [suppliers, search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError("");
            if (editing) {
                await updateSupplier(editing.id, form);
            } else {
                await createSupplier(form);
            }
            setShowModal(false);
            await loadSuppliers();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to save supplier."));
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deactivate this supplier?")) return;
        try {
            await deleteSupplier(id);
            await loadSuppliers();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to delete supplier."));
        }
    };

    return (
        <PharmacistLayout
            title="Supplier Management"
            subtitle="Manage medicine suppliers"
            action={
                <button
                    onClick={() => {
                        setEditing(null);
                        setForm(emptyForm);
                        setShowModal(true);
                    }}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                    + Add Supplier
                </button>
            }
        >
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-6 grid gap-5 md:grid-cols-3">
                <Summary title="Total suppliers" value={suppliers.length} />
                <Summary
                    title="Active"
                    value={suppliers.filter((supplier) => supplier.active).length}
                />
                <Summary title="Search results" value={filtered.length} />
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search supplier..."
                className="mb-6 w-full max-w-md rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">Loading...</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                {["Supplier", "Phone", "Email", "Address", "Status", "Actions"].map(
                                    (heading) => (
                                        <th
                                            key={heading}
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500"
                                        >
                                            {heading}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        {supplier.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {supplier.phone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {supplier.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {supplier.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                supplier.active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {supplier.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditing(supplier);
                                                    setForm({
                                                        name: supplier.name,
                                                        email: supplier.email || "",
                                                        phone: supplier.phone || "",
                                                        address: supplier.address || "",
                                                    });
                                                    setShowModal(true);
                                                }}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier.id)}
                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-bold">
                            {editing ? "Edit Supplier" : "Add Supplier"}
                        </h3>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                        <input
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="Phone"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Email"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                        <textarea
                            required
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder="Address"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 rounded-xl border px-4 py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </PharmacistLayout>
    );
}

function Summary({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        </div>
    );
}
