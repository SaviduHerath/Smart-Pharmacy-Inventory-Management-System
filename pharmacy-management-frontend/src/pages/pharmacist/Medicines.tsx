import { useMemo, useState } from "react";

interface Medicine {
    id: number;
    name: string;
    category: string;
    supplier: string;
    price: number;
    stock: number;
}

const initialMedicines: Medicine[] = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        supplier: "ABC Pharma",
        price: 25.00,
        stock: 120,
    },
    {
        id: 2,
        name: "Amoxicillin 500mg",
        category: "Antibiotic",
        supplier: "HealthCare Ltd",
        price: 45.00,
        stock: 75,
    },
    {
        id: 3,
        name: "Cetirizine 10mg",
        category: "Allergy",
        supplier: "MediPlus",
        price: 15.00,
        stock: 8,
    },
];

export default function Medicines() {

    const [medicines, setMedicines] =
        useState<Medicine[]>(initialMedicines);

    const [search, setSearch] = useState("");

    const [category, setCategory] =
        useState("ALL");

    const [showModal, setShowModal] =
        useState(false);

    const [editingMedicine, setEditingMedicine] =
        useState<Medicine | null>(null);

    const [form, setForm] = useState({
        name: "",
        category: "Pain Relief",
        supplier: "",
        price: "",
        stock: "",
    });

    
    // =========================
    // FILTER
    // =========================

    const filteredMedicines = useMemo(() => {

        return medicines.filter((medicine) => {

            const matchesSearch =
                medicine.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                category === "ALL" ||
                medicine.category === category;

            return matchesSearch &&
                matchesCategory;
        });

    }, [medicines, search, category]);


    // =========================
    // OPEN ADD MODAL
    // =========================

    const handleAdd = () => {

        setEditingMedicine(null);

        setForm({
            name: "",
            category: "Pain Relief",
            supplier: "",
            price: "",
            stock: "",
        });

        setShowModal(true);
    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const handleEdit = (medicine: Medicine) => {

        setEditingMedicine(medicine);

        setForm({
            name: medicine.name,
            category: medicine.category,
            supplier: medicine.supplier,
            price: medicine.price.toString(),
            stock: medicine.stock.toString(),
        });

        setShowModal(true);
    };


    // =========================
    // SAVE
    // =========================

    const handleSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (
            !form.name ||
            !form.supplier ||
            !form.price ||
            !form.stock
        ) {
            return;
        }


        if (editingMedicine) {

            setMedicines((current) =>
                current.map((medicine) =>
                    medicine.id === editingMedicine.id
                        ? {
                            ...medicine,
                            name: form.name,
                            category: form.category,
                            supplier: form.supplier,
                            price: Number(form.price),
                            stock: Number(form.stock),
                        }
                        : medicine
                )
            );

        } else {

            const newMedicine: Medicine = {
                id: Date.now(),
                name: form.name,
                category: form.category,
                supplier: form.supplier,
                price: Number(form.price),
                stock: Number(form.stock),
            };

            setMedicines((current) => [
                ...current,
                newMedicine,
            ]);
        }

        setShowModal(false);
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = (id: number) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this medicine?"
            );

        if (!confirmed) {
            return;
        }

        setMedicines((current) =>
            current.filter(
                (medicine) =>
                    medicine.id !== id
            )
        );
    };


    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================= SIDEBAR ================= */}

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
                        className="mb-1 flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium"
                    >
                        💊
                        <span className="ml-3">
                            Medicines
                        </span>
                    </a>


                    <a
                        href="/pharmacist/inventory"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        📦
                        <span className="ml-3">
                            Inventory
                        </span>
                    </a>


                    <a
                        href="/pharmacist/prescriptions"
                        className="flex rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        📋
                        <span className="ml-3">
                            Prescriptions
                        </span>
                    </a>

                </nav>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="ml-64">

                {/* Navbar */}

                <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

                    <div className="flex h-full items-center justify-between px-8">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Medicines
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage pharmacy medicines
                            </p>

                        </div>


                        <button
                            onClick={handleAdd}
                            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                        >
                            + Add Medicine
                        </button>

                    </div>

                </header>


                {/* Content */}

                <div className="pt-20">

                    <div className="p-8">

                        {/* ================= FILTERS ================= */}

                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex flex-col gap-4 md:flex-row">

                                {/* Search */}

                                <div className="flex-1">

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search medicine..."
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                    />

                                </div>


                                {/* Category */}

                                <div className="w-full md:w-56">

                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                    >

                                        <option value="ALL">
                                            All Categories
                                        </option>

                                        <option value="Pain Relief">
                                            Pain Relief
                                        </option>

                                        <option value="Antibiotic">
                                            Antibiotic
                                        </option>

                                        <option value="Allergy">
                                            Allergy
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* ================= TABLE ================= */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h3 className="font-bold text-slate-800">
                                    Medicine List
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {filteredMedicines.length} medicines found
                                </p>

                            </div>


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
                                                Supplier
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
                                                    className="hover:bg-slate-50"
                                                >

                                                    {/* Medicine */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                                                                💊
                                                            </div>

                                                            <span className="font-medium text-slate-800">
                                                                {medicine.name}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* Category */}

                                                    <td className="px-6 py-4">

                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                            {medicine.category}
                                                        </span>

                                                    </td>


                                                    {/* Supplier */}

                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {medicine.supplier}
                                                    </td>


                                                    {/* Price */}

                                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                        Rs. {medicine.price.toFixed(2)}
                                                    </td>


                                                    {/* Stock */}

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                medicine.stock <= 10
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-emerald-100 text-emerald-700"
                                                            }`}
                                                        >
                                                            {medicine.stock}
                                                        </span>

                                                    </td>


                                                    {/* Actions */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex gap-2">

                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        medicine
                                                                    )
                                                                }
                                                                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                                            >
                                                                Edit
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        medicine.id
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>


                                {/* Empty */}

                                {filteredMedicines.length === 0 && (

                                    <div className="p-10 text-center">

                                        <div className="text-4xl">
                                            💊
                                        </div>

                                        <p className="mt-3 font-medium text-slate-700">
                                            No medicines found
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Try changing your search or filter.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </main>


            {/* ================= MODAL ================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h3 className="text-lg font-bold text-slate-800">
                                    {editingMedicine
                                        ? "Edit Medicine"
                                        : "Add Medicine"}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Enter medicine information
                                </p>

                            </div>


                            <button
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
                            className="space-y-4 p-6"
                        >

                            {/* Name */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Medicine Name
                                </label>

                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Paracetamol 500mg"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                />

                            </div>


                            {/* Category */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Category
                                </label>

                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                                >

                                    <option>
                                        Pain Relief
                                    </option>

                                    <option>
                                        Antibiotic
                                    </option>

                                    <option>
                                        Allergy
                                    </option>

                                </select>

                            </div>


                            {/* Supplier */}

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
                                            supplier: e.target.value,
                                        })
                                    }
                                    placeholder="Supplier name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                />

                            </div>


                            {/* Price + Stock */}

                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Price
                                    </label>

                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                price: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                    />

                                </div>


                                <div>

                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Stock
                                    </label>

                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                stock: e.target.value,
                                            })
                                        }
                                        placeholder="0"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                    />

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="flex gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
                                >
                                    {editingMedicine
                                        ? "Update Medicine"
                                        : "Add Medicine"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}