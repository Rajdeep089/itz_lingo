import React, { useCallback, useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
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

  // Debounced change handler
  const debouncedOnChange = useCallback(debounce(onChange, 300), [onChange]);

  // Get min and max values when their state changes
  useEffect(() => {
    debouncedOnChange({ min: minVal, max: maxVal });

    // Cleanup the debounce on unmount
    return () => {
      debouncedOnChange.cancel();
    };
  }, [minVal, maxVal, debouncedOnChange]);

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="relative w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="absolute w-full h-0 pointer-events-none z-30"
          style={{
            zIndex: minVal > max - 100 ? 5 : "auto",
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="absolute w-full h-0 pointer-events-none z-40"
          style={{
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />

        <div className="relative">
          <div  className="absolute w-full h-2 bg-gray-400 rounded" />
          <div
            ref={range}
            className="absolute h-2 bg-blue-700 rounded "
          />
          <div className="absolute left-1 text-black text-xs mt-4">{minVal}</div>
          <div className="absolute right-1 text-black text-xs mt-4">{maxVal}</div>
        </div>
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 1px 1px #000000;
          cursor: pointer;
          pointer-events: all;
          position: relative;
          margin-top: 4px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 1px 1px #000000;
          cursor: pointer;
          pointer-events: all;
          position: relative;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
