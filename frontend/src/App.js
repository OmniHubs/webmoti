import React, { Component } from 'react';
import './App.css';
import Navbar from "./Components/Navbar";
import Stream from "./Components/Stream";
import socketIOClient from "socket.io-client";


class App extends Component  {
    constructor(props){
        super(props);
        // empty currently
        this.state = {
            apiResponse: "",
            anotherResponse: "",
            endpoint: "http://127.0.0.1:4001"
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
        const { endpoint } = this.state
        const socket = socketIOClient(endpoint)
        socket.on("video", video => this.setState({ response: video }))
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                <Navbar/>
                <Stream/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">{this.state.apiResponse}</p>
                <p className="anotherIntro">{this.state.anotherResponse}</p>
                <p className="anotherAnotherIntro">{this.state.response}</p>
            </div>
        );
    }

}

export default App;
