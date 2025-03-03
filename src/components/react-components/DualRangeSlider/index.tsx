import { useCallback, useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";

interface DualRangeSliderProps {
  min: number;
  max: number;
  minId?: string;
  maxId?: string;
  onChange?: (value: { min: number; max: number }) => void;
}

const DualRangeSlider = ({ min, max, ...props }: DualRangeSliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement | null>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    props.onChange && props.onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, props.onChange]);

  return (
    <div className={styles.dual_range_container}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        id={props.minId}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className={`${styles.thumb} ${styles["thumb--left"]}`}
        style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        id={props.maxId}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className={`${styles.thumb} ${styles["thumb--right"]}`}
      />

      <div className={styles.slider}>
        <div className={styles.slider__track} />
        <div ref={range} className={styles.slider__range} />
        <div className={styles["slider__left-value"]}>$ {minVal}</div>
        <div className={styles["slider__right-value"]}>$ {maxVal}</div>
      </div>
    </div>
  );
};

export default DualRangeSlider;
