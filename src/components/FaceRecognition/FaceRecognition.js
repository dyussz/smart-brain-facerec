import React from "react";
import './FaceRecognition.css'; // optional for styling

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        {imageUrl && (
          <img id="inputImage" alt="Detected" src={imageUrl} width="500px" height="auto" />
        )}
        {box && (
          <div
            className="bounding-box"
            style={{
              top: box.topRow * 500, // multiply by image width/height
              right: 500 - box.rightCol * 500,
              bottom: 500 - box.bottomRow * 500,
              left: box.leftCol * 500,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;
