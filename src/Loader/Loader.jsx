import React from "react";
import "./Loader.css";

const Loader = ({ 
  size = "medium", 
  fullScreen = false, 
  message = ""
}) => {
  const containerClass = fullScreen 
    ? "loader-container loader-fullscreen" 
    : "loader-container";

  return (
    <div className={containerClass}>
      <div className={`loader-spinner loader-${size}`}>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;

