import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from "./Components/Navbar";

class App extends Component  {
    constructor(props){
        super(props);
        // empty currently
        this.state = { apiResponse: ""}
    }

    callAPI(){
        fetch("http://localhost:9000/classroom")
            .then(res => res.text())
            .then(res=> this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount(){
        this.callAPI();
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                <Navbar/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }

}

export default App;
