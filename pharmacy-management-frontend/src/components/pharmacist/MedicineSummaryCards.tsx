interface MedicineSummary {
    totalMedicines: number;
    lowStock: number;
    outOfStock: number;
    expired: number;
}

interface MedicineSummaryCardsProps {
    summary: MedicineSummary;
}

export default function MedicineSummaryCards({
    summary,
}: MedicineSummaryCardsProps) {

    const cards = [
        {
            title: "Total Medicines",
            value: summary.totalMedicines,
            icon: "💊",
        },
        {
            title: "Low Stock",
            value: summary.lowStock,
            icon: "⚠️",
        },
        {
            title: "Out of Stock",
            value: summary.outOfStock,
            icon: "🚫",
        },
        {
            title: "Expired",
            value: summary.expired,
            icon: "⏰",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                {card.title}
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-slate-800">
                                {card.value}
                            </h3>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                            {card.icon}
                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}