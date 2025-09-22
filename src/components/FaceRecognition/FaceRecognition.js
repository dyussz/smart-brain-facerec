import React from "react";

const FaceRecognition = ({ imageUrl }) => {
  if (!imageUrl) return null; // do not render anything if no URL

  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img alt='Detected' src={imageUrl} width='500px' height='auto' />
      </div>
    </div>
  );
};

export default FaceRecognition;
