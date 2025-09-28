import './FaceRecognition.css';

// ADDED BOX AND IMAGELOAD HERE
const FaceRecognition = ({ imageUrl, box, onImageLoad }) => {
  return (
    <div className="center ma">
      <div className="relative-container mt2">
        {/* Added id="inputImage" to allow calculateFaceLocation() in App.jsx to find the image DOM node and get its dimensions for drawing the bounding box */}
        {imageUrl && (
          <img
            id="inputImage"
            alt="Detected"
            src={imageUrl}
            width="500px" 
            height="auto" 
            onLoad={onImageLoad} 
          />
        )}
        <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> 
      </div>
    </div>
  );
};

export default FaceRecognition;
