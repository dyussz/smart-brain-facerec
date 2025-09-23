import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import './App.css';
import ParticlesBg from "particles-bg";


const PAT = process.env.REACT_APP_CLARIFAI_API_KEY;
const USER_ID = process.env.USER_ID;
const APP_ID = "face-recognition";             
const MODEL_ID = "face-detection";  
const MODEL_VERSION_ID =  process.env.MODEL_VERSION_ID;
const BASE_URL = `https://api.clarifai.com/api/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            imageUrl: "",
            box: {},
        };
    }

    calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height
    };
}
    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = async () => {
        const { input } = this.state;
        this.setState({ imageUrl: input }); // show image immediately

        const raw = JSON.stringify({
            user_app_id: {
                user_id: USER_ID,
                app_id: APP_ID
            },
            inputs: [
                {
                    data: {
                        image: { url: input }
                    }
                }
            ]
        });

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Key " + PAT
                },
                body: raw
            });
            console.log(response);

            const data = await response.json();
            console.log("API response:", response.status, response.statusText);
            console.log("Clarifai response:", data);

            // Example: get first bounding box if exists
            if (data.outputs && data.outputs[0].data.regions) {
                const box = data.outputs[0].data.regions[0].region_info.bounding_box;
                console.log("Bounding box:", box);
            } else {
                console.log("No faces detected.");
            }
        } catch (err) {
            console.error("Clarifai API error:", err);
        }
    }

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
                <FaceRecognition imageUrl={this.state.imageUrl} />
            </div>
        );
    }
}

export default App;
