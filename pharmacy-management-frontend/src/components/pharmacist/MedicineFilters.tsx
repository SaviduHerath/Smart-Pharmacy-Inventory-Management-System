interface MedicineFiltersProps {
    search: string;
    filter: string;
    pageSize: number;

    onSearchChange: (value: string) => void;
    onFilterChange: (value: string) => void;
    onPageSizeChange: (value: number) => void;
}

export default function MedicineFilters({
    search,
    filter,
    pageSize,
    onSearchChange,
    onFilterChange,
    onPageSizeChange,
}: MedicineFiltersProps) {

    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}
                <div className="relative w-full lg:w-96">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search medicine, category, supplier..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <span className="absolute left-4 top-3 text-slate-400">
                        🔍
                    </span>

                </div>


                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">

                    {/* Status Filter */}
                    <select
                        value={filter}
                        onChange={(e) =>
                            onFilterChange(e.target.value)
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >

                        <option value="ALL">
                            All Medicines
                        </option>

                        <option value="LOW_STOCK">
                            Low Stock
                        </option>

                        <option value="OUT_OF_STOCK">
                            Out of Stock
                        </option>

                        <option value="NEAR_EXPIRY">
                            Near Expiry
                        </option>

                        <option value="EXPIRED">
                            Expired
                        </option>

                    </select>


                    {/* Page Size */}
                    <select
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(
                                Number(e.target.value)
                            )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >

                        <option value={5}>
                            5 / page
                        </option>

                        <option value={10}>
                            10 / page
                        </option>

                        <option value={20}>
                            20 / page
                        </option>

                        <option value={50}>
                            50 / page
                        </option>

                    </select>

                </div>

            </div>

        </div>
    );
}