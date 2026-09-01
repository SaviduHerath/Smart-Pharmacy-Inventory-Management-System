import { useEffect, useState } from "react";
import PharmacistLayout from "../../components/pharmacist/PharmacistLayout";
import MedicineSummaryCards from "../../components/pharmacist/MedicineSummaryCards";
import MedicineFilters from "../../components/pharmacist/MedicineFilters";
import { getApiErrorMessage } from "../../services/api";
import {
    createMedicine,
    deleteMedicine,
    getDashboardSummary,
    getMedicinesWithFilter,
    updateMedicine,
    type DashboardSummary,
    type Medicine,
    type MedicineRequest,
} from "../../services/medicineService";
import { getActiveSuppliers, type Supplier } from "../../services/supplierService";

type FilterType = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEAR_EXPIRY" | "EXPIRED";

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

export default function MedicineManagement() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [summary, setSummary] = useState<DashboardSummary>({
        totalMedicines: 0,
        lowStock: 0,
        outOfStock: 0,
        expired: 0,
        nearExpiry: 0,
        totalSuppliers: 0,
    });
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Medicine | null>(null);
    const [form, setForm] = useState<MedicineRequest>(emptyForm);
    const [saving, setSaving] = useState(false);

    const loadSummary = async () => {
        const data = await getDashboardSummary();
        setSummary(data);
    };

    const loadMedicines = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getMedicinesWithFilter(
                search,
                filter,
                currentPage,
                pageSize,
                "id",
                "asc"
            );
            setMedicines(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load medicines."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSummary();
        getActiveSuppliers().then(setSuppliers).catch(() => setSuppliers([]));
    }, []);

    useEffect(() => {
        loadMedicines();
    }, [search, filter, currentPage, pageSize]);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (medicine: Medicine) => {
        setEditing(medicine);
        setForm({
            medicineName: medicine.medicineName,
            genericName: medicine.genericName,
            category: medicine.category,
            supplier: medicine.supplier || "",
            batchNumber: medicine.batchNumber,
            quantity: medicine.quantity,
            unitPrice: medicine.unitPrice,
            expiryDate: medicine.expiryDate,
            reorderLevel: medicine.reorderLevel,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            if (editing) {
                await updateMedicine(editing.id, form);
            } else {
                await createMedicine(form);
            }
            setShowModal(false);
            await loadMedicines();
            await loadSummary();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to save medicine."));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this medicine?")) return;
        try {
            await deleteMedicine(id);
            await loadMedicines();
            await loadSummary();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to delete medicine."));
        }
    };

    return (
        <PharmacistLayout
            title="Medicine Management"
            subtitle="Manage pharmacy medicines and stock"
            action={
                <button
                    onClick={openAdd}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                    + Add Medicine
                </button>
            }
        >
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-8">
                <MedicineSummaryCards summary={summary} />
            </div>

            <MedicineFilters
                search={search}
                filter={filter}
                pageSize={pageSize}
                onSearchChange={(value) => {
                    setSearch(value);
                    setCurrentPage(0);
                }}
                onFilterChange={(value) => {
                    setFilter(value as FilterType);
                    setCurrentPage(0);
                }}
                onPageSizeChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(0);
                }}
            />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        Loading medicines...
                    </div>
                ) : medicines.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">No medicines found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    {["Medicine", "Category", "Supplier", "Price", "Stock", "Expiry", "Actions"].map(
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
                                {medicines.map((medicine) => (
                                    <tr key={medicine.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {medicine.medicineName}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {medicine.genericName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {medicine.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {medicine.supplier}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            Rs. {Number(medicine.unitPrice).toFixed(2)}
                                        </td>
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
                                        <td className="px-6 py-4 text-sm">{medicine.expiryDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(medicine)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(medicine.id)}
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((page) => page - 1)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-500">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage((page) => page + 1)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editing ? "Edit Medicine" : "Add Medicine"}
                            </h3>
                            <button onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            <Field
                                label="Medicine name"
                                value={form.medicineName}
                                onChange={(value) => setForm({ ...form, medicineName: value })}
                            />
                            <Field
                                label="Generic name"
                                value={form.genericName}
                                onChange={(value) => setForm({ ...form, genericName: value })}
                            />
                            <Field
                                label="Category"
                                value={form.category}
                                onChange={(value) => setForm({ ...form, category: value })}
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Supplier
                                </label>
                                <select
                                    value={form.supplier}
                                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.name}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Field
                                label="Batch number"
                                value={form.batchNumber}
                                onChange={(value) => setForm({ ...form, batchNumber: value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Quantity"
                                    type="number"
                                    value={String(form.quantity)}
                                    onChange={(value) =>
                                        setForm({ ...form, quantity: Number(value) })
                                    }
                                />
                                <Field
                                    label="Unit price"
                                    type="number"
                                    value={String(form.unitPrice)}
                                    onChange={(value) =>
                                        setForm({ ...form, unitPrice: Number(value) })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Expiry date"
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={(value) => setForm({ ...form, expiryDate: value })}
                                />
                                <Field
                                    label="Reorder level"
                                    type="number"
                                    value={String(form.reorderLevel)}
                                    onChange={(value) =>
                                        setForm({ ...form, reorderLevel: Number(value) })
                                    }
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white disabled:bg-emerald-300"
                                >
                                    {saving ? "Saving..." : editing ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PharmacistLayout>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            <input
                required
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
        </div>
    );
}
