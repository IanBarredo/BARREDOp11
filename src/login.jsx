import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { API_ENDPOINT } from './Api';
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [passwordx, setPasswordx] = useState('');
  const [error, setError] = useState('');

  /* Verify if user in session in localStorage */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log('No valid token');
      }
    };

    fetchUser();
  }, [navigate]);

  /* Performs login method */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(` ${API_ENDPOINT}/auth/login`, {
        username,
        passwordx,
      });

      // Assuming the response contains the token in response.data.token
      localStorage.setItem("token", JSON.stringify(response));
      setError(''); // Clear any previous errors
      navigate("/dashboard"); // Redirect to dashboard

    } catch (error) {
      // Handle errors and display message
      const errorMessage = error.response?.data?.message || 'Invalid username or password';
      setError(errorMessage);
    }
  };

  return (
    <>
      <Navbar bg="secondary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home"> VOGUE TECH ENTREPRENUER</Navbar.Brand>
        </Container>
      </Navbar>
      <br /><br /><br /><br /><br /><br />

      <Container>
        <Row className="justify-content-md-start"> {/* Change class to "justify-content-md-end" */}
          <Col md={4}>
            <div className="login-form">
              <div className="container">
                <div className="login-logo">
                  {/* <img src={logo} width={'38%'} alt="Logo" /> */}
                </div>
                <center style={{ color: '#0d0604', fontFamily: 'Nosifer', fontSize: '20px' }}> Ian Barredo<br /> Tech Entrepreneur
                </center>&nbsp;

                <div className="card">
                  <div className="card-body login-card-body">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formUsername">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                          className="form-control-sm rounded-0"
                          type="text"
                          placeholder="Enter Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group><br />

                      <Form.Group controlId="formPasswordx">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                          className="form-control-sm rounded-0"
                          type="password"
                          placeholder="Enter Password"
                          value={passwordx}
                          onChange={(e) => setPasswordx(e.target.value)}
                          required
                        />
                      </Form.Group><br />

                      <Form.Group controlId="formButton">
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Button
                          variant="success"
                          className="btn btn-block bg-custom btn-flat rounded-0"
                          size="sm"
                          block="block"
                          type="submit"
                        >
                          Login &nbsp;
                        </Button>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
