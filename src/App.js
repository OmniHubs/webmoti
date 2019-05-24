import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import webMoti from './images/webMoti.png';
import Background from './images/astroBk.jpg';
import './App.css';

function App() {
  return (
    <div className="App">


      <header className="App-header">

          <img src={webMoti} alt="webMoti" width="100" height="100" />
      </header>


      <body>
          <Container>
              <Row>
                  <Col>1 of 3</Col>
                  <Col xs={6}>2 of 3 (wider)</Col>
                  <Col>3 of 3</Col>
              </Row>
              <Row>
                  <Col>1 of 3</Col>
                  <Col xs={5}>2 of 3 (wider)</Col>
                  <Col>3 of 3</Col>
              </Row>
          </Container>;

      </body>
    </div>
  );
}

export default App;
