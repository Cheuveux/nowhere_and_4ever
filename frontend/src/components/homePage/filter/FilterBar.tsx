import type { FilterType } from "./useFilter";

const FILTERS: {label: string, value: FilterType}[] = [
	{ label: "ALL", value: "all" },
	{ label: "ARTICLE", value: "article" },
	{ label: "TAKE", value: "take" },
	{ label: "SPECIAL", value: "special" },
];
	export default function FilterBar({
		active,
		onToggle,
	}: {
		active: FilterType;
		onToggle: (f: FilterType) => void;
	}) {
		return (
			<div className="filter-bar">
				{FILTERS.map(f => (
				<button
					key={f.value}
					className={`filter-btn ${active === f.value ? "filter-btn--active": ""}`}
					onClick={() => onToggle(f.value)}
				>
					{f.label}
				</button>
				))}
			</div>
		);
	}
