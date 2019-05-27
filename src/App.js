import React, {Component} from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import webMoti from './images/webMoti.png';
import { Button } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap/Navbar'





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
                <header>
                    <div>
                        <Navbar color="light" light expand="md">

                        </Navbar>;
                    </div>
                    );
                    }
                    }
                    {/*<img src={webMoti} alt="webMoti" width="100" height="100"/>*/}
                </header>

                <body>

                <div className="container-fluid">
                    {/*<img id="hello"  src={Background} />*/}
                    <div className="text-block">
                        <Button variant="primary" onClick="login()">
                            Login To your account
                        </Button>
                    </div>
                </div>
                {/*<Container>*/}
                {/*    <Row>*/}
                {/*        <Col>1 of 3</Col>*/}
                {/*        <Col xs={6}>2 of 3 (wider)</Col>*/}
                {/*        <Col>3 of 3</Col>*/}
                {/*    </Row>*/}
                {/*    <Row>*/}
                {/*        <Col>1 of 3</Col>*/}
                {/*        <Col xs={5}>2 of 3 (wider)</Col>*/}
                {/*        <Col>3 of 3</Col>*/}
                {/*    </Row>*/}
                {/*</Container>;*/}

                </body>
            </div>
        );
    }
}

