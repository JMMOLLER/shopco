import { atom } from "nanostores";

export const $isFilterOpen = atom(false);
export const $pagination = atom<PaginatorType | null>(null)
