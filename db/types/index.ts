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

export { decimal };
