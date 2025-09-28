import React, {Component} from 'react';
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import './App.css';
import ParticlesBg from "particles-bg";
import Signin from "./components/Signin/Signin.jsx";
import Register from "./components/Register/Register.jsx";

/*Preparing the API request from Clarifai*/
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
};

const initialState = {
    input: "",
    imageUrl: "",
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
        this.lastClarifaiData = null;
        this.imageLoaded = false; //maybe don't need it
    }


    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        });
    };

    /*loadUser(data) {
        this.setState({user: data});
    } */


    //bounding box//
    calculateFaceLocation = (data) => {
        try {
            console.log("Calculating face location with data: " + JSON.stringify(data, null, 2));
            const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
            const image = document.getElementById('inputImage');
            const width = Number(image.width);
            const height = Number(image.height);
            console.log(width, height);
            console.log(clarifaiFace);
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
        this.setState({box});
    };

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        console.log("Calling button submit");
        fetch('http://localhost:3001/imageurl', { // если что удали целиком
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log("response imageUrl" +  JSON.stringify(response, null, 2));
                if (response) {
                    console.log("User id: " + this.state.user.id);
                    fetch('http://localhost:3001/image', { // если что удали целиком
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            input: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries: count}));
                        }).catch(error => {
                            console.log("error calling image url", error)
                    })
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            }).catch(err =>
                console.log(err));
    }

    //we make a put request to the backend, sending the user id, and we expect back the count of entries//
//     updateUserEntries => {
//     fetch('http://localhost:3001/signin', {
//     method: 'put',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//     id: this.state.user.id
// })
// .then(response => response.json())
//     .then(count => {
//         this.setState(prevState => ({
//             user: {
//                 ...prevState.user,
//                 entries: count
//             }
//         }));
//     })
//     .then(result => {
//         console.log("Clarifai result:", result);
//         this.lastClarifaiData = result;
//         if (this.imageLoaded) {
//             const box = this.calculateFaceLocation(this.lastClarifaiData);
//             this.displayFaceBox(box);
//         }
//     })
//     .catch(error => console.log("error", error));
// })


    onImageLoad = () => {
        this.imageLoaded = true;
        if (this.lastClarifaiData) {
            const box = this.calculateFaceLocation(this.lastClarifaiData);
            this.displayFaceBox(box);
        }
    };

    onRouteChange = (route) => {
        console.log("Calling route change" + route);
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    };

    render() {
        const {route, isSignedIn} = this.state;
        return (
            <div className="App">
                <ParticlesBg type="circle" bg={true} num={50}/>
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {route === 'home'
                    ? <div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            imageUrl={this.state.imageUrl}
                            box={this.state.box}
                            onImageLoad={this.onImageLoad}
                        />
                    </div>
                    : (
                        route === 'signin'
                            ? <Signin loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
