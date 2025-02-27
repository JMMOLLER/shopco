import { atom, map } from "nanostores";

export const $isFilterOpen = atom(false);
export const $pagination = atom<PaginatorType | null>(null);

type ScriptStatus = { paginator: boolean; shop: boolean };
export const $status = map<ScriptStatus>({ paginator: false, shop: false });

type PaginationEvent = { page: number; popState: boolean };
export const $pageChangeEvent = atom<PaginationEvent | undefined>(undefined);
