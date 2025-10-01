import React from 'react';
const HOST_NAME = import.meta.env.VITE_API_HOST_NAME;
class Signin extends React.Component {
    constructor(props) { //props from app.js//
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => { //route when email changes//
        this.setState({signInEmail: event.target.value})
    }
    onPasswordChange = (event) => { //route when password changes//
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch(`${HOST_NAME}/signin`, { // route to backend//
            method: 'post',
            headers: {'Content-Type': 'application/json'}, //specify json content//
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json()) //getting response and converting to json//
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
            }).catch(error => console.log(error));
    }

    render() { //destructuring//
        const {onRouteChange} = this.props; //pulling out onRouteChange from props//
        return ( //returns jsx//
            <article className="br3 ba b--black-10 mv4 w-50-m w-25-l mw6 center shadow-5"> //styling//
                <main className="pa4 black-80">
                    <div className="measure"> //centering//
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Sign In, no regrets</legend> 
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label> //htmlFor instead of for in react//
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange} //updates state//
                                />
                            </div>
                            <div className="mv3"> //margin vertical//
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="tc"> //contains Sign in button//
                            <input
                                onClick={this.onSubmitSignIn}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit" //wraps submit button//
                                value="Sign in"
                            />
                        </div>
                        <div className="lh-copy mt3"> //line height and margin top//
                            <p onClick={() => onRouteChange('register')} //
                               className="f6 link dim black db pointer">Register</p> //a link to register//
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;