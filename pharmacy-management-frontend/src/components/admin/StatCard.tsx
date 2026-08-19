interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: string;
}

export default function StatCard({
    title,
    value,
    description,
    icon,
}: StatCardProps) {

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-800">
                        {value}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                    {icon}
                </div>

            </div>

        </div>
    );
}

