import React, { useCallback, useMemo, useState, useId } from "react";
import styles from "./styles.module.css";

export type ProcessInputEvent = (
  e: HTMLInputElement,
  setter: React.Dispatch<React.SetStateAction<number>>,
  prev: number
) => void;

interface InputQuantityProps {
  onIncrease?: ProcessInputEvent;
  onDecrease?: ProcessInputEvent;
  defaultValue?: string | number;
  max?: string | number;
  min?: string | number;
  itemClass?: string;
  className?: string;
  id?: string;
}

function InputQuantity(props: InputQuantityProps) {
  const { className = "", min = "1", max = "99" } = props;
  const [currentValue, setCurrentValue] = useState<number>(
    Number(props.defaultValue) || 1
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = props.id || useId();

  const defaultValue = useMemo(() => {
    return Number(props.defaultValue) || 1;
  }, [props.defaultValue]);

  const maxValue = useMemo(() => {
    return Number(max);
  }, [max]);

  const minValue = useMemo(() => {
    return Number(min);
  }, [min]);

  const handleDecrease = useCallback(() => {
    if (currentValue <= minValue) return;
    setCurrentValue(currentValue - 1);
    props.onDecrease?.(inputRef.current!, setCurrentValue, defaultValue);
  }, [currentValue, minValue]);

  const handleIncrease = useCallback(() => {
    if (currentValue >= maxValue) return;
    setCurrentValue(currentValue + 1);
    props.onIncrease?.(inputRef.current!, setCurrentValue, defaultValue);
  }, [currentValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      const newValue = Math.max(minValue, Math.min(maxValue, value));
      setCurrentValue(newValue);

      if (newValue > currentValue) {
        props.onIncrease?.(e.target, setCurrentValue, defaultValue);
      } else if (newValue < currentValue) {
        props.onDecrease?.(e.target, setCurrentValue, defaultValue);
      }
    },
    [maxValue, minValue, currentValue]
  );

  return (
    <div
      className={`bg-primary rounded-full h-full text-2xl px-3 py-2 ${styles.isolated} ${className}`}
    >
      <label htmlFor={id} className="sr-only">
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
          id={id}
          name={id}
          type="number"
          autoComplete="off"
          className={`text-center bg-transparent rounded-md text-base ${styles} ${
            props.itemClass || ""
          }`}
          max={props.max || "99"}
          onChange={handleChange}
          min={props.min || "1"}
          aria-label="Quantity"
          value={currentValue}
          ref={inputRef}
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
