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

const category = customType<{ data: CategoryType }>({
  dataType() {
    return "text";
  }
});

// SizeType

const size = customType<{ data: SizeType }>({
  dataType() {
    return "text";
  }
});

// DressStyleType

const suitStyle = customType<{ data: SuitStyleType }>({
  dataType() {
    return "text";
  },
  fromDriver(value) {
    return (value as string).split(",") as SuitStyleType;
  }
});

export { decimal, category, size, suitStyle };
