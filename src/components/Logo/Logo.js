import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  const defaultOptions = {
    reverse:        false,
    max:            55,
    perspective:    1000,
    scale:          1.1,
    speed:          1000,
    transition:     true,
    axis:           null,
    reset:          true,
    easing:         "cubic-bezier(.03,.98,.52,.99)",
  };

  return (
   <div className="ma4 mt0">
      <Tilt tiltMaxAngleX={defaultOptions.max} 
      tiltMaxAngleY={defaultOptions.max} 
      style={{ height: 150, width: 150 }}>
        <div style={{ height: "100%", background: "light-blue", borderRadius: "10px" }}>
          <img src={brain} alt="logo"></img>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
