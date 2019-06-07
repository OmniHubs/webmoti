import React, {Component} from 'react';
import socketIOClient from "socket.io-client";



class Stream extends Component  {
    constructor(props){
        super(props);
        // empty currently
        this.state = {
            apiResponse: "",
            endpoint: "http://127.0.0.1:8000"
        }
    }

    // callAPI(){
    //     fetch("http://localhost:9000/classroom")
    //         .then(res => res.text())
    //         .then(res=> this.setState({ apiResponse: res }))
    //         .catch(err => err);
    // }

    componentDidMount(){
        // this.callAPI();
        const { endpoint } = this.state
        const socket = socketIOClient(endpoint)
        socket.on("FromAPI", text => this.setState({ response: text }))
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">{this.state.apiResponse}</p>
                <p className="anotherAnotherIntro">{this.state.response}</p>
            </div>
        );
    }

}

export default Stream;
