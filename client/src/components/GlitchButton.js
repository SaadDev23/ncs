import React, { useState } from "react";
import "../components/screens/FspcLogin/style.css"; // Create a CSS file for styling

function GlitchButton({ text }) {
    const [hovered, setHovered] = useState(false);
  
    const handleMouseEnter = () => {
      if (!hovered) {
        setHovered(true);
      }
    };
  
    return (
      <button
        className={`glitch-button ${hovered ? "hovered" : ""}`}
        data-text={text}
        onMouseEnter={handleMouseEnter}
      >
        {text}
      </button>
    );
  }

export default GlitchButton;