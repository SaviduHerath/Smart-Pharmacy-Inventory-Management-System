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
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-400 backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mb-8 grid gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl shadow-black/10 backdrop-blur-md md:grid-cols-2 lg:grid-cols-5"
            >
                <select
                    required
                    value={medicineId}
                    onChange={(e) => setMedicineId(e.target.value)}
                    className="rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                >
                    <option value="" className="bg-slate-800">Select medicine</option>
                    {medicines.map((medicine) => (
                        <option key={medicine.id} value={medicine.id} className="bg-slate-800">
                            {medicine.medicineName} ({medicine.quantity})
                        </option>
                    ))}
                </select>
                <select
                    value={transactionType}
                    onChange={(e) =>
                        setTransactionType(e.target.value as TransactionType)
                    }
                    className="rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                >
                    <option value="IN" className="bg-slate-800">Stock IN</option>
                    <option value="OUT" className="bg-slate-800">Stock OUT</option>
                </select>
                <input
                    required
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
                <input
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason"
                    className="rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder:text-slate-500"
                />
                <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Update stock
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl shadow-black/10 backdrop-blur-md">
                <div className="border-b border-slate-700/50 bg-slate-800/80 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-white tracking-wide">Stock Transactions</h3>
                        <p className="mt-1 text-sm font-medium text-emerald-400/80">
                            {transactions.length} records found
                        </p>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-emerald-400">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                        <p className="mt-4 text-sm font-medium">Loading inventory...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    {["Medicine", "Type", "Qty", "Reason", "Pharmacist", "Date"].map(
                                        (heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400"
                                            >
                                                {heading}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="transition-colors hover:bg-slate-700/30">
                                        <td className="px-6 py-4 font-semibold text-slate-200">
                                            {transaction.medicineName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                                    transaction.transactionType === "IN"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${transaction.transactionType === "IN" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                                                {transaction.transactionType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-300">
                                            {transaction.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {transaction.reason}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-300">
                                            {transaction.userName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(transaction.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PharmacistLayout>
    );
}
