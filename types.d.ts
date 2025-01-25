interface IconProps {
  className: string;
}

interface MainLayoutProps {
  id?: string;
  title: string;
  className?: string;
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
  readonly timestamp: Date;
};

interface ProductDetail {
  readonly id: string;
  readonly productId: string;
  readonly size: SizeType;
  readonly color: string;
  readonly stock: number;
}