import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageURL, boxes, onImageLoad }) => {
    if (!imageURL) {
    return (
        <div className="center ma" style={{ padding: "20px", fontSize: "18px", color: "#555" }}>
            <p>No image provided. Please enter an image to detect faces.</p>
        </div>
        );
    }

    return (
        <div className="center ma">
            <div className="image-container" style={{ position: "relative" }}>
                <img
                    id="inputImage"
                    src={imageURL}
                    alt="Detected" 
                    width="500px"
                    height="auto"
                    onLoad={onImageLoad}
                />
                {boxes &&
                    boxes.map((box, i) => (
                        <div
                            key={i}
                            className="bounding-box"
                            style={{
                                top: box.topRow,
                                left: box.leftCol,
                                width: box.width,
                                height: box.height,
                                position: "absolute",
                                border: "3px solid #149df2",
                                boxShadow: "0 0 0 3px #149df2 inset",
                            }}
                        ></div>
                    ))}
            </div>
        </div>
    );
};

export default FaceRecognition;