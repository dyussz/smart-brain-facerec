import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import './App.css';
import ParticlesBg from "particles-bg";

/*Peparing the API request from Clarifai*/
const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = import.meta.env.VITE_API_PAT;
  const USER_ID = import.meta.env.VITE_API_USER_ID;
  const APP_ID = import.meta.env.VITE_API_APP_ID;
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            imageUrl: "",
            box: {},
        };

        this.lastClarifaiData = null; // NEW
        /*---lastClarifaiData---
        Purpose: Stores the latest response from the Clarifai API.
        Reason: The face detection API returns the coordinates of detected faces, but you can’t calculate the box until the image is fully loaded in the DOM.
        It acts as a temporary cache so that the face box can be calculated once the image is ready.
        */


        this.imageLoaded = false; // NEW flag
        /*---imageLoaded---
        Purpose: A flag to track whether the image has finished loading in the browser.
        Reason: You can’t calculate face coordinates relative to the image size until the image is loaded, because the width and height of the <img> element aren’t known yet.
        When true, it’s safe to calculate the face box.
        */
    }

    calculateFaceLocation = (data) => {
    try {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        };
    } catch (error) {
        console.error("Error calculating face location:", error);
        return {};
        }
    };

    displayFaceBox = (box) => {
        this.setState({ box });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    // UPDATED FUNCTION
    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input, box: {} });
        this.imageLoaded = false; // reset flag

        const MODEL_ID = 'face-detection';
        const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

        fetch(
        `/api/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        returnClarifaiRequestOptions(this.state.input)
        )
        .then((response) => response.json())
        .then((result) => {
            console.log("Clarifai result:", result);
            this.lastClarifaiData = result;
            // If image has already loaded, calculate immediately
            if (this.imageLoaded) {
            const box = this.calculateFaceLocation(this.lastClarifaiData);
            this.displayFaceBox(box);
            }
        })
        .catch((error) => console.log("error", error));
    };

    /* 
  Why are calculateFaceLocation() and this.displayFaceBox(box) called twice (first inside the .then() after fetching Clarifai API and then again inside onImageLoad?
  Answer: Because we don’t know which will happen first: the image loading or the API response arriving.
  
  const box = this.calculateFaceLocation(this.lastClarifaiData);
  this.displayFaceBox(box); 

  Reason:
  The API response and the image load can happen in any order.
  The code handles both scenarios:
  Image loads first → wait for API to calculate box.
  API responds first → wait for image to load to calculate box.
  This avoids the problem where the bounding box might be calculated when the image size is unknown, which would break the display.
  */

  // NEW: called when image is loaded
  onImageLoad = () => {
    this.imageLoaded = true; // mark image as ready
    if (this.lastClarifaiData) {
      const box = this.calculateFaceLocation(this.lastClarifaiData);
      this.displayFaceBox(box);
    }
  };

    render() {
        return (
            <div className="App">
                <ParticlesBg type="circle" bg={true} num={50} />
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition 
                    imageUrl={this.state.imageUrl}
                    box={this.state.box}
                    onImageLoad={this.onImageLoad}  // NEW
                />
            </div>
        );
    }
}

export default App;
