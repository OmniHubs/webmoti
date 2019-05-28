import React, {Component} from 'react';
import './App.css';

import webMoti from './images/webMoti.png';
import Button from '@material-ui/core/Button';
import Navbar from './components/Navbar'





 export default class App extends Component{
     constructor(props) {
         super(props);

         this.toggle = this.toggle.bind(this);
         this.state = { isOpen: false };
     }

     toggle() {
         this.setState({
             isOpen: !this.state.isOpen
         });
     }
    render() {
        return (
            <div className="App">
                <Navbar/>

                <body>

                <div className="container-fluid">
                    {/*<img id="hello"  src={Background} />*/}
                    <div className="text-block">
                        <Button variant="primary">
                            Login To your account
                        </Button>
                    </div>
                </div>

                </body>
            </div>
        );
    }
}

