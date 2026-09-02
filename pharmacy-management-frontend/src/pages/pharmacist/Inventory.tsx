import { useEffect, useState } from "react";
import PharmacistLayout from "../../components/pharmacist/PharmacistLayout";
import { getApiErrorMessage } from "../../services/api";
import { getAllMedicines, type Medicine } from "../../services/medicineService";
import {
    getAllStockTransactions,
    processStock,
    type StockTransaction,
    type TransactionType,
} from "../../services/stockService";

export default function Inventory() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [medicineId, setMedicineId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [transactionType, setTransactionType] = useState<TransactionType>("IN");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const [medicineData, stockData] = await Promise.all([
                getAllMedicines(),
                getAllStockTransactions(),
            ]);
            setMedicines(medicineData);
            setTransactions(stockData);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load inventory."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError("");
            setSuccess("");
            await processStock({
                medicineId: Number(medicineId),
                transactionType,
                quantity,
                reason,
            });
            setReason("");
            setQuantity(1);
            setSuccess("Stock updated successfully.");
            await load();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update stock."));
        }
    };

    return (
        <PharmacistLayout
            title="Inventory"
            subtitle="Stock in, stock out, and transaction history"
        >
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-5"
            >
                <select
                    required
                    value={medicineId}
                    onChange={(e) => setMedicineId(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                    <option value="">Select medicine</option>
                    {medicines.map((medicine) => (
                        <option key={medicine.id} value={medicine.id}>
                            {medicine.medicineName} ({medicine.quantity})
                        </option>
                    ))}
                </select>
                <select
                    value={transactionType}
                    onChange={(e) =>
                        setTransactionType(e.target.value as TransactionType)
                    }
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                    <option value="IN">Stock IN</option>
                    <option value="OUT">Stock OUT</option>
                </select>
                <input
                    required
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <input
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <button className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600">
                    Update stock
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h3 className="font-bold text-slate-800">Stock transactions</h3>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">Loading...</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                {["Medicine", "Type", "Qty", "Reason", "Pharmacist", "Date"].map(
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
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4">{transaction.medicineName}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                transaction.transactionType === "IN"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                        >
                                            {transaction.transactionType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{transaction.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {transaction.reason}
                                    </td>
                                    <td className="px-6 py-4 text-sm">{transaction.userName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(transaction.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </PharmacistLayout>
    );
}
