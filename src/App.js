import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import './App.css';
import ParticlesBg from "particles-bg";

// ===== Clarifai API setup =====
const PAT = "ec975b6eb117472d9f3ff17e3303329f"; 
const USER_ID = "rmac84yu3jbs";           
const APP_ID = "face-recognition";             
const MODEL_ID = "face-detection";   
const BASE_URL = "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs";

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
        };
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = async () => {
        this.setState({ imageUrl: this.state.input });

        const raw = JSON.stringify({
            user_app_id: {
                user_id: USER_ID,
                app_id: APP_ID
            },
            inputs: [
                {
                    data: {
                        image: {
                            url: this.state.input
                        }
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

            const data = await response.json();
            console.log("Clarifai response:", data);

            // Example: get first bounding box
            const box = data.outputs[0].data.regions[0].region_info.bounding_box;
            console.log("Bounding box:", box);

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
