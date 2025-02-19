import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.css";

interface InputQuantityProps {
  defaultValue?: string | number;
  max?: string | number;
  min?: string | number;
  itemClass?: string;
  className?: string;
  id?: string;
}

function InputQuantity(props: InputQuantityProps) {
  const { className, min = "1", max = "99" } = props;
  const [currentValue, setCurrentValue] = useState<number>(
    Number(props.defaultValue) || 1
  );

  const maxValue = useMemo(() => {
    return Number(max);
  }, [max]);

  const minValue = useMemo(() => {
    return Number(min);
  }, [min]);

  const handleDecrease = useCallback(() => {
    if (currentValue <= minValue) return;
    if (currentValue > 1) {
      setCurrentValue(currentValue - 1);
    }
  }, [currentValue]);

  const handleIncrease = useCallback(() => {
    if (currentValue >= maxValue) return;
    setCurrentValue(currentValue + 1);
  }, [currentValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setCurrentValue(() => {
        if (value > maxValue) {
          return maxValue;
        } else if (value < minValue) {
          return minValue;
        } else {
          return value;
        }
      });
    },
    [maxValue, minValue]
  );

  return (
    <div
      className={`bg-primary rounded-full h-full text-2xl px-3 py-2 ${styles.isolated} ${
        className || ""
      }`}
    >
      <label htmlFor="quantity" className="sr-only">
        Quantity
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="min-w-5 text-black"
          aria-label="Decrease quantity"
          onClick={handleDecrease}
        >
          -
        </button>
        <input
          id={props.id}
          type="number"
          autoComplete="off"
          name={props.id || "quantity"}
          className={`text-center bg-transparent rounded-md text-base ${styles} ${
            props.itemClass || ""
          }`}
          value={currentValue}
          max={props.max || "99"}
          min={props.min || "1"}
          aria-label="Quantity"
          onChange={handleChange}
        />
        <button
          type="button"
          className="min-w-5 text-black"
          aria-label="Increase quantity"
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default InputQuantity;
