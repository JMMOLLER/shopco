interface IconProps {
  class?: string;
}

interface MainLayoutProps {
  id?: string;
  title: string;
  className?: string;
  clientRouter?: boolean;
}

interface PaginatorType {
  currentPage: number;
  /**
   * @summary Total de páginas
   */
  totalPages: number;
  /**
   * @summary Total de items que se muestran en la página
   */
  total: number;
}

// PRODUCT
type CategoryType = "other" | "t-shirt" | "short" | "shirt" | "jean";

type SizeType =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large"
  | "3x-large"
  | "4x-large";

type SuitStyleType = ("casual" | "formal" | "party" | "gym")[];

interface Product {
  readonly id: string | number;
  readonly title: string;
  readonly thumbnailUrl: string | null;
  readonly rating: number | string;
  readonly discount: number | null;
  readonly price: number;
  readonly category: CategoryType;
  readonly suitStyle: SuitStyleType;
  readonly inventory: ProductDetail[];
  readonly timestamp: Date | string;
}

interface ProductDetail {
  readonly id: string;
  readonly productId: string;
  readonly size: SizeType;
  readonly color: string;
  readonly stock: number;
}

// CART

interface Cart {
  readonly id: string;
  readonly items: CartItem[];
}

type LocalCart = Map<
  string,
  {
    readonly id: string;
    readonly quantity: number;
    readonly timestamp: string;
    readonly productId: string;
    readonly productDetail: ProductDetail;
  }
>;

interface CartItem {
  readonly id: string;
  readonly productDetailId: string;
  readonly quantity: number;
  readonly userId: string;
  readonly timestamp: Date | string;
}

// LUCIA

/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}

// GLOBAL
declare namespace globalThis {
  interface Window {
    user: import("lucia").User | null;
  }
}
