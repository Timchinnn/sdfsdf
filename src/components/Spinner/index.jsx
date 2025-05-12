import React from "react";
import "./styles.scss";
const Spinner = ({
  loading = true,
  color = "#ffffff",
  size = 150,
  cssOverride = {},
  speedMultiplier = 1,
}) => {
  if (!loading) return null;
  const spinnerStyle = {
    ...cssOverride,
    width: size,
    height: size,
    borderColor: color,
    borderTopColor: "transparent",
    animationDuration: `${0.7 / speedMultiplier}s`,
  };
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={spinnerStyle}
        role="status"
        aria-label="Loading Spinner"
      />
    </div>
  );
};
export default Spinner;
