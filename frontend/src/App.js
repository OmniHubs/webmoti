import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from "./Components/Navbar";
//import Video from "./Components/Video"
//import Video from "./Components/Video";

// with ES6 import
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";


class App extends Component  {
    constructor(props){
        super(props);
        // empty currently
        this.state = {
            apiResponse: "",
            anotherResponse: "",
            socketEndpoint: "http://127.0.0.1:4001",
            video: null
        }
    }

    callAPI(){
        fetch("http://localhost:9000/classroom")
            .then(res => res.text())
            .then(res=> this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    anotherAPI(){
        fetch("http://localhost:9000/student")
            .then(res => res.text())
            .then(res => this.setState({anotherResponse: res }))
            .catch(err => err);
    }



    componentDidMount(){
        this.callAPI();
        this.anotherAPI();
        const { socketEndpoint } = this.state;
        const socket = socketIOClient(socketEndpoint);







        socket.on("fromSocket", data => this.setState({ response: data }));

        //Getting Webcam Media
        let constraints = { audio: true, video: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                /* use the stream */
                socket.emit("stre", stream, function (data) {
                    console.log(data);
                });


    });


    }

    render(){
        return (
            <div className="App">
                <header className="App-header">
                <Navbar/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>

                <p className="App-intro">{this.state.apiResponse}</p>
                <p className="anotherIntro">{this.state.anotherResponse}</p>
                <p className="anotherIntro">{this.state.response}</p>
            </div>
        );
    }
}
export default App;
