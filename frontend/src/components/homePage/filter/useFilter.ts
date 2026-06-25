import { useState } from "react";
import type  {HomeItem}  from "../articles"

export type FilterType = "all" | "article" | "take" | "mosaic"| "special";

const SPECIAL_TYPES= ["conversation"];

export function	filterPosts(posts: HomeItem[], filter: FilterType) : HomeItem[] {

	if (filter === "all")
			return(posts);
	if (filter == "take")
			return (posts.filter(p => p._type == "takes"));
	if (filter == "article")
			return (posts.filter(p => p._type == "article"));
	if (filter == "mosaic")
			return (posts.filter(p => p._type == "mosaic"));
	if (filter == "special")
			return (posts.filter(p=> SPECIAL_TYPES.includes(p._type)));
	return (posts);
}

export function useFilter() {
	const	[activeFilter, setActiveFilter] = useState<FilterType>("all");
	const	toggle = (filter: FilterType) => {
		setActiveFilter(prev => prev === filter ? "all" : filter);
	}
	return { activeFilter, toggle };
}