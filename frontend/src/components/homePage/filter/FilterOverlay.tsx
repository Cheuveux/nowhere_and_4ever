import { useEffect } from "react";
import type { FilterType } from "./useFilter";

const FILTERS : { label: string, value: FilterType, description: string} [] = [
	{label : "ALL", value: "all", description : "Tout le contenu disponible"},
	{label : "ARTICLE", value: "article", description : "Articles & écrits"},
	{label : "TAKE", value: "take", description : "Takes & opinions"},
	{label : "SPECIAL", value: "special", description : "Tout pleins de surprise"},
]

export default function FilterOverlay ({
	isOpen,
	active,
	onToggle,
	onClose
} : {
	isOpen: boolean;
	active: FilterType;
	onToggle: (f: FilterType) => void;
	onClose: () => void;
}) {

	// Fermer avec esc
	useEffect(() => {
		const	handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape")
				onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	// Bloquer le scroll quand on ouvre le menu de filtre
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {document.body.style.overflow = ""; };
	}, [isOpen]);

	if (!isOpen)
		return (null);
	return (
		<div className="filter-overlay" onClick={onClose}>
			<div className="filter-overlay--panel" onClick={e => e.stopPropagation()}>
				<button className="filter-overlay--close" onClick={onClose}>x</button>
				<h3 className="filter-overlay--item">Filter</h3>
				<ul className="filter-overlay--list">
					{FILTERS.map(f => (
						<li key={f.value}>
							<button 
							className={`filter-overlay--item ${active === f.value ? "filter-overlay--item--active" : ""}`}
							onClick={() => { onToggle(f.value); onClose(); }}
							>
								<span className="filter-overlay--label">{f.label}</span>
								<span className="filter-overlay--description">{f.description}</span>
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}