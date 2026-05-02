import React from "react";
import "../../styles/Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="fullscreen-loader">
      <div className="multi-dot-loader"></div>
    </div>
  );
};

export default Loader;