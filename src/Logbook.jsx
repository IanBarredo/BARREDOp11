import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import  { jwtDecode }  from 'jwt-decode';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {FormControl, Dropdown, DropdownButton, Carousel, ModalHeader } from 'react-bootstrap';
import { API_ENDPOINT } from './Api';

import Swal from 'sweetalert2';

import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

function Logbook () {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecodeUserID = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);

                const decoded_token = jwtDecode(response.data.token);
                //console.log(decoded_token.tyep_id);
                setUser(decoded_token);
                //console.log(user.type_id);

            } catch (error) {
                navigate("/login")
            }
        };
    
    fetchDecodeUserID();

}, []);

    const handleLogout = async () => {

    try {
        localStorage.removeItem('token');
        navigate("/login");

    } catch (error) {
        console.error('Logout failed', error);
    }
};

/* Fetch Data */

const [users, setUsers] = useState([])

const userdata = JSON.parse(localStorage.getItem('token'));
const token = userdata.data.token;

const headers = {
    accept: 'application/json',
    Authorization: token
}

useEffect(()=>{
    fetchUsers()
    }, [])
    const fetchUsers = async (e) => {
    await axios.get(`${API_ENDPOINT}/user`, { headers: headers}).then(({data})=>{
    setUsers(data) 
})
    }

/* Delete User */
const deleteUser = async (id) => {

    const isConfirm = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'blue',
        cancelButtonColor: 'red',
        confirmButtonText: 'Yes. Delete it'
    }).then((result) => {
        return result.isConfirmed
    });

    if(!isConfirm) {
        return;
    }

    await axios.delete(`${API_ENDPOINT}/user/${id}`, {headers: headers}).then(({data})=>{
        Swal.fire({
            icon: 'success',
            text: 'Successfully Deleted'
        })
        fetchUsers()
    }).catch(({response:{data}}) => {
        Swal.fire({
            text:data.message,
            icon: "error"
        })
    })
}

/* Create User */
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const [fullname, setFullname] = useState("")
const [username, setUsername] = useState("")      
const [passwordx, setPasswordx] = useState("")
const [validationError, setValidationError] = useState({})

const createUser = async (e) => {

    e.preventDefault();

    const formData = new FormData()

    formData.append('fullname', fullname)
    formData.append('username', username) /* Dapat ang mga yaon digdi, same sa database */
    formData.append('passwordx', passwordx)

    await axios.post(`${API_ENDPOINT}/user`, {fullname, username, passwordx}, {headers: headers}).then(({data})=>{
        Swal.fire({
            icon: 'success',
            text:data.message
        })
        fetchUsers();

    }).catch(({response})=>{
        if(response.status===422){
            setValidationError(response.data.errors)
        }else{
            Swal.fire({
                text:response.data.message,
                icon: 'error'
            })
        }
    })
}

/* Read User */
const [selectedUser, setSelectedUser] = useState(null);
const [show1, setShow1] = useState(false);

const handleClose1 = () => setShow1(false);

const handleShow1 = (row_users) => {
    setSelectedUser(row_users);
    setShow1(true);
};

/* Update User */

const [show2, setShow2] = useState(false);
const handleClose2 = () => setShow2(false);

const [selectedUserId, setSelectedUserId] = useState(null);
const [fullnames, setFullnames] = useState("");
const [usernames, setUsernames] = useState("");
const [passwords, setPasswords] = useState("");
const [validationError2, setValidationError2] = useState({});

const handleShow2 = (users) => {
    setSelectedUserId(users.user_id);
    setFullnames(users.fullname);           /* Dapat digdi, same sa database */
    setUsernames(users.username);
    setPasswords(users.password || '');
    setShow2(true);
};

const updateUser = async (e) => {
    e.preventDefault();
    await axios.put(`${API_ENDPOINT}/user/${selectedUserId}`, 
    { fullname: fullnames, username: usernames, passwordx: passwords }, 
    { headers: headers })
        .then(({ data }) => {
            Swal.fire({ icon: 'success', text: data.message });
            fetchUsers();
            setShow2(false);
        })
        .catch(({ response }) => {
            if (response.status === 422) {
                setValidationError2(response.data.errors);
            } else {
                Swal.fire({ text: response.data.message, icon: 'error' });
            }
        });
};

return(
        <>

<Navbar className='custom-navbar'>

<Container>
    <Navbar.Brand as={Link} to="/dashboard">Tech Entrepreneur</Navbar.Brand>
    <Nav className='me-auto'>
            <Nav.Link as={Link} to="/fantasy">Magazines</Nav.Link>
            
    </Nav>

<Navbar.Collapse id="basic-navbar-nav">

<Nav className="ms-auto">
    <Nav.Link as={Link} to="/logbook">Logbook</Nav.Link>
    <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">
        <NavDropdown.Item href="#">Profile</NavDropdown.Item>
        <NavDropdown.Item href="#">Setings</NavDropdown.Item>
        <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
    </NavDropdown>
</Nav>

</Navbar.Collapse>
</Container>
</Navbar>

<br/><br/>

<Container style={{ backgroundColor: '#F5F5DC'}}>
    <Row>
        <Col>
        <center>
        <h1 style={{fontFamily: 'Junge'}}>Logbook</h1>
        </center>
        </Col>
    </Row>
</Container>

<br/>

<div className='logbook-container'>

    <div>
        <Button variant="btn btn-success mb-2 float-end btn-sm me-2" onClick={handleShow}>Create User</Button>
    </div>

    <table className='table table-bordered'>

        <tbody>
            <tr>
                <td>ID</td>
                <td>Username</td>
                <td>Fullame</td>
                <td>Action</td>
            </tr>

            {
            users.length > 0 && (
                users.map((row_users, key) =>(
                    <tr key={row_users.user_id}>
                        <td>{row_users.user_id}</td>         
                        <td>{row_users.username}</td>
                        <td>{row_users.fullname}</td>
                        <td style={{ textAlign: 'center' }}>
        <Button variant='secondary' size='sm' onClick={()=>handleShow1(row_users)}>Read</Button>
        <Button variant='warning' size='sm' onClick={()=>handleShow2(row_users)}>Update</Button>
        <Button variant="danger" size="sm" onClick={() => deleteUser(row_users.user_id)}>Delete</Button>
                        </td>
                    </tr>
                ))
            )
        }
        </tbody>

    </table>
</div>


<Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>Create User</Modal.Title>
        </Modal.Header>

        <Modal.Body>

        <Form onSubmit={createUser}>
            <Row>
                <Col>
                <Form.Group controlId='Fullname'>
                    <Form.Label>Fullname</Form.Label>
                    <Form.Control type='text' value={fullname} onChange={(event)=>{setFullname(event.target.value)}} required/>
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                <Form.Group controlId='Username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' value={username} onChange={(event)=>{setUsername(event.target.value)}} required/>
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                <Form.Group controlId='Password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='text' value={passwordx} onChange={(event)=>{setPasswordx(event.target.value)}} required/>
                </Form.Group>
                </Col>
            </Row>

            <Button variant = "primary" className="mt-2" size="sm" block="block" type="submit">Save</Button>

        </Form>
        </Modal.Body>
</Modal>

<Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
            <Modal.Title>Row Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {selectedUser ? (
                <div>
                    <p><strong>ID:</strong> {selectedUser.user_id}</p>
                    <p><strong>Fullname:</strong> {selectedUser.fullname}</p>
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                    <p><strong>Date Joined:</strong> {selectedUser.created_at}</p>
                </div>
            ): (
                <p>No Data Available</p>
            )}
        </Modal.Body>

</Modal>

<Modal show={show2} onHide={handleClose2}>
                <Modal.Header>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUser}>
                        <Form.Group controlId='Fullname'>
                            <Form.Label>Fullname</Form.Label>
                            <Form.Control
                                type='text'
                                value={fullnames}
                                onChange={(e) => setFullnames(e.target.value)}
                                isInvalid={!!validationError2.fullname}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{validationError2.fullname}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId='Username'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                value={usernames}
                                onChange={(e) => setUsernames(e.target.value)}
                                isInvalid={!!validationError2.username}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{validationError2.username}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId='Password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='text'
                                value={passwords}
                                onChange={(e) => setPasswords(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-2" size="sm" type="submit">Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>


</>
    )
};

export default Logbook;