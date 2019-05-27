import React, {Component} from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import webMoti from './images/webMoti.png';
import { Button } from 'react-bootstrap';
import {Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from 'react-bootstrap/Navbar'





 class App extends Component() {
    constructor(props){
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {isOpen: false};
    }
    render() {
        return (
            <div className="App">
                <header>
                    <div>
                        <Navbar color="light" light expand="md">
                            <NavbarBrand href="/">reactstrap</NavbarBrand>
                            <NavbarToggler onClick={this.toggle}/>
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink href="/components/">Components</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            Options
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                Option 1
                                            </DropdownItem>
                                            <DropdownItem>
                                                Option 2
                                            </DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>
                                                Reset
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                    );
                    }
                    }
                    <img src={webMoti} alt="webMoti" width="100" height="100"/>
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

export default App;
