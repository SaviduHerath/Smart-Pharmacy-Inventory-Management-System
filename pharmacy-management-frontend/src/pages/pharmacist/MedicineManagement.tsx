import { useEffect, useState } from "react";
import {
    getAllMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    type Medicine,
    type MedicineRequest,
} from "../../services/medicineService";

export default function MedicineManagement() {

    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

const [editingMedicine, setEditingMedicine] =
    useState<Medicine | null>(null);

const [saving, setSaving] = useState(false);

const [deletingId, setDeletingId] =
    useState<number | null>(null);

const [success, setSuccess] = useState("");

const emptyForm: MedicineRequest = {
    medicineName: "",
    genericName: "",
    category: "",
    supplier: "",
    batchNumber: "",
    quantity: 0,
    unitPrice: 0,
    expiryDate: "",
    reorderLevel: 10,
};

const [form, setForm] =
    useState<MedicineRequest>(emptyForm);

    const loadMedicines = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllMedicines();

            setMedicines(data);

        } catch (err) {

            console.error("Medicine loading error:", err);

            setError("Failed to load medicines.");

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadMedicines();
    }, []);

    const openAddModal = () => {

    setEditingMedicine(null);

    setForm(emptyForm);

    setError("");
    setSuccess("");

    setShowModal(true);
};


const openEditModal = (medicine: Medicine) => {

    setEditingMedicine(medicine);

    setForm({
        medicineName: medicine.medicineName || "",
        genericName: medicine.genericName || "",
        category: medicine.category || "",
        supplier: medicine.supplier || "",
        batchNumber: medicine.batchNumber || "",
        quantity: medicine.quantity ?? 0,
        unitPrice: medicine.unitPrice ?? 0,
        expiryDate: medicine.expiryDate || "",
        reorderLevel: medicine.reorderLevel ?? 10,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
};


const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
) => {

    e.preventDefault();

    try {

        setSaving(true);
        setError("");
        setSuccess("");

        if (editingMedicine) {

            await updateMedicine(
                editingMedicine.id,
                form
            );

            setSuccess(
                "Medicine updated successfully."
            );

        } else {

            await createMedicine(form);

            setSuccess(
                "Medicine added successfully."
            );
        }

        setShowModal(false);

        setEditingMedicine(null);

        setForm(emptyForm);

        await loadMedicines();

    } catch (err: any) {

        console.error(
            "Medicine save error:",
            err
        );

        setError(
            err.response?.data?.message ||
            "Failed to save medicine."
        );

    } finally {

        setSaving(false);
    }
};

const handleDelete = async (
    id: number
) => {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this medicine?"
        );

    if (!confirmed) {
        return;
    }

    try {

        setDeletingId(id);

        setError("");
        setSuccess("");

        await deleteMedicine(id);

        setSuccess(
            "Medicine deleted successfully."
        );

        await loadMedicines();

    } catch (err: any) {

        console.error(
            "Medicine delete error:",
            err
        );

        setError(
            err.response?.data?.message ||
            "Failed to delete medicine."
        );

    } finally {

        setDeletingId(null);
    }
};

    const filteredMedicines = medicines.filter((medicine) =>
    (medicine.medicineName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

    (medicine.category || "")
        .toLowerCase()
        .includes(search.toLowerCase())
);


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
                            Pharmacist Panel
                        </p>

                    </div>

                </div>


                <nav className="mt-6 px-3">

                    <a
                        href="/pharmacist"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        ▦
                        <span className="ml-3">
                            Dashboard
                        </span>
                    </a>

                    <a
                        href="/pharmacist/medicines"
                        className="flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium"
                    >
                        💊
                        <span className="ml-3">
                            Medicines
                        </span>
                    </a>

                </nav>

            </aside>


            {/* Main */}
            <main className="ml-64">

                {/* Header */}
                <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

                    <div className="flex h-full items-center justify-between px-8">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Medicine Management
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage pharmacy medicines and stock
                            </p>

                        </div>


                        <button
                            onClick={openAddModal}
                            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                            + Add Medicine
                        </button>

                    </div>

                </header>


                {/* Content */}
                <div className="pt-20">

                    <div className="p-8">
                        {success && (
                            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Search */}
                        <div className="mb-6 flex items-center justify-between">

                            <div className="relative w-96">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search medicine or category..."
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />

                                <span className="absolute left-4 top-3 text-slate-400">
                                    🔍
                                </span>

                            </div>


                            <div className="text-sm text-slate-500">

                                {filteredMedicines.length} medicines

                            </div>

                        </div>


                        {/* Medicine Table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h3 className="font-bold text-slate-800">
                                    All Medicines
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Medicines currently available in the system
                                </p>

                            </div>


                            {loading ? (

                                <div className="p-10 text-center text-sm text-slate-500">
                                    Loading medicines...
                                </div>

                            ) : filteredMedicines.length === 0 ? (

                                <div className="p-10 text-center">

                                    <div className="text-4xl">
                                        💊
                                    </div>

                                    <p className="mt-3 font-medium text-slate-700">
                                        No medicines found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try another search term.
                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-slate-50">

                                            <tr>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Medicine
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Category
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Price
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Stock
                                                </th>

                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {filteredMedicines.map(
                                                (medicine) => (

                                                    <tr
                                                        key={medicine.id}
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        {/* Medicine */}
                                                        <td className="px-6 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                                                                    💊
                                                                </div>

                                                                <div>

                                                                    <p className="font-semibold text-slate-800">
                                                                        {medicine.medicineName}
                                                                    </p>

                                                                    {medicine.genericName && (
                                                                        <p className="max-w-xs truncate text-xs text-slate-400">
                                                                            {medicine.genericName}
                                                                        </p>
                                                                    )}

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* Category */}
                                                        <td className="px-6 py-4">

                                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                                {medicine.category}
                                                            </span>

                                                        </td>


                                                        {/* Price */}
                                                        <td className="px-6 py-4 font-medium text-slate-700">

                                                            Rs.{" "}
                                                            {Number(medicine.unitPrice).toFixed(2)}

                                                        </td>


                                                        {/* Stock */}
                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    medicine.quantity === 0
                                                                        ? "bg-red-100 text-red-700"
                                                                        : medicine.quantity <= medicine.reorderLevel
                                                                        ? "bg-amber-100 text-amber-700"
                                                                        : "bg-emerald-100 text-emerald-700"
                                                                }`}
                                                            >
                                                                {medicine.quantity} units
                                                            </span>

                                                        </td>


                                                        {/* Actions */}
                                           <td className="px-6 py-4">

                                                            <div className="flex gap-2">

                                                                <button
                                                                    onClick={() =>
                                                                        openEditModal(medicine)
                                                                    }
                                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                                                >
                                                                    Edit
                                                                </button>


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(medicine.id)
                                                                    }
                                                                    disabled={
                                                                        deletingId === medicine.id
                                                                    }
                                                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {deletingId === medicine.id
                                                                        ? "Deleting..."
                                                                        : "Delete"}
                                                                </button>

                                                            </div>

                                                        </td>     

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </main>

        {showModal && (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>

                    <h3 className="text-lg font-bold text-slate-800">

                        {editingMedicine
                            ? "Edit Medicine"
                            : "Add Medicine"}

                    </h3>

                    <p className="text-sm text-slate-500">

                        {editingMedicine
                            ? "Update medicine details"
                            : "Add a new medicine to the system"}

                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setShowModal(false)
                    }
                    className="text-xl text-slate-400 hover:text-slate-700"
                >
                    ×
                </button>

            </div>


            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
            >

                {/* Medicine Name */}

                <div>

                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Medicine Name
                    </label>

                    <input
                        required
                        value={form.medicineName}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                medicineName:
                                    e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        placeholder="Enter medicine name"
                    />

                </div>


                {/* Generic Name */}

                <div>

                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Generic Name
                    </label>

                    <input
                        required
                        value={form.genericName}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                genericName:
                                    e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        placeholder="Enter generic name"
                    />

                </div>


                {/* Category + Supplier */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Category
                        </label>

                        <input
                            required
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                            placeholder="e.g. Antibiotic"
                        />

                    </div>


                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Supplier
                        </label>

                        <input
                            required
                            value={form.supplier}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    supplier:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                            placeholder="Enter supplier"
                        />

                    </div>

                </div>


                {/* Batch + Expiry */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Batch Number
                        </label>

                        <input
                            required
                            value={form.batchNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    batchNumber:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                            placeholder="Enter batch number"
                        />

                    </div>


                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Expiry Date
                        </label>

                        <input
                            required
                            type="date"
                            value={form.expiryDate}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    expiryDate:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                    </div>

                </div>


                {/* Quantity + Price + Reorder */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Quantity
                        </label>

                        <input
                            required
                            min="0"
                            type="number"
                            value={form.quantity}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    quantity:
                                        Number(
                                            e.target.value
                                        ),
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                    </div>


                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Unit Price
                        </label>

                        <input
                            required
                            min="0"
                            step="0.01"
                            type="number"
                            value={form.unitPrice}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    unitPrice:
                                        Number(
                                            e.target.value
                                        ),
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                    </div>


                    <div>

                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Reorder Level
                        </label>

                        <input
                            required
                            min="0"
                            type="number"
                            value={form.reorderLevel}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    reorderLevel:
                                        Number(
                                            e.target.value
                                        ),
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                    </div>

                </div>


                {/* Buttons */}

                <div className="flex gap-3 border-t border-slate-100 pt-5">

                    <button
                        type="button"
                        onClick={() =>
                            setShowModal(false)
                        }
                        disabled={saving}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {saving
                            ? "Saving..."
                            : editingMedicine
                            ? "Update Medicine"
                            : "Create Medicine"}

                    </button>

                </div>

            </form>

        </div>

    </div>

)}    

        </div>
    );
}

