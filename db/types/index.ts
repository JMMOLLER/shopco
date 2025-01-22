import { customType } from "drizzle-orm/sqlite-core";

interface DecimalOptions {
  precision: number;
  scale: number;
}

const decimal = (name: string, options: DecimalOptions) =>
  customType<{ data: number }>({
    dataType() {
      return `decimal(${options.precision || 7}, ${options.scale || 2})`;
    },
    fromDriver(value) {
      return Number(value);
    }
  })();

// CategoryType

type CategoryType = "other" | "t-shirt" | "short" | "shirt" | "jean";

const category = customType<{ data: CategoryType }>({
  dataType() {
    return "text";
  }
});

// SizeType

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

const size = customType<{ data: SizeType }>({
  dataType() {
    return "text";
  }
});

// DressStyleType

type SuitStyleType = ("casual" | "formal" | "party" | "gym")[];

const suitStyle = customType<{ data: SuitStyleType }>({
  dataType() {
    return "text";
  },
  fromDriver(value) {
    return (value as string).split(",") as SuitStyleType;
  }
});

export { decimal, category, size, suitStyle };
