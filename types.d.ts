interface IconProps {
  className: string;
}

interface MainLayoutProps {
  title: string;
  className?: string;
}

interface Product {
  readonly id: number;
  readonly title: string;
  readonly thumbnailUrl: string | null;
  readonly rating: number | string;
  readonly discount: number | null;
  readonly price: number;
  readonly timestamp: Date;
};