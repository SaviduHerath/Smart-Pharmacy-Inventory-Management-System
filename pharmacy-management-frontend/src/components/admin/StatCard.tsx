interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: string | React.ReactNode;
}

export default function StatCard({
    title,
    value,
    description,
    icon,
}: StatCardProps) {

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-md p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                        {title}
                    </p>
                    <h3 className="mt-3 text-4xl font-bold text-white tracking-tight">
                        {value}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-emerald-400/80">
                        {description}
                    </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 text-2xl text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            </div>
        </div>
    );
}

