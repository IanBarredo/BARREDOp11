// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { API_ENDPOINT } from './Api';

// import './Dashboard.css';

// // Sample image URLs
// const images = [
//   "V1.jpg", // Add your image URLs here
//   "V2.jpg",
//   "V3.jpg",
//   "V4.jpg",
//   "V5.jpg",
//   "V6.jpg"
// ];

// function Dashboard() {

//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     /*Verify if user in session in local storage */
//     useEffect(() => {
//       const fetchDecodedUserID = async () => {
//         try {
//             const response = JSON.parse(localStorage.getItem('token'));
//             setUser(response.data);

//             const decoded_token = jwtDecode(response.data.token);
//             setUser(decoded_token);
//         } catch (error) {
//             navigate("/login");
//         }
//       };

//       fetchDecodedUserID();
//     }, []);

//     /* performs logout method */
//     const handleLogout = async () => {
//       try {
//           localStorage.removeItem('token');
//           navigate("/login");
//       } catch (error) {
//         console.error('Logout failed', error);
//       }
//     };

//   return (
//     <>
//       <Navbar bg="secondary" data-bs-theme="dark">
//         <Container>
//           <Navbar.Brand href="#home">TECH ENTERPRENEUR</Navbar.Brand>
//           <Nav.Link href="#users">Users</Nav.Link>
//           <Nav.Link href="#departments">Departments</Nav.Link>
//           <Nav.Link href="#courses">Courses</Nav.Link>
//           <Nav />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">
//                 <NavDropdown.Item href="#">Profile</NavDropdown.Item>
//                 <NavDropdown.Item href="#">Settings</NavDropdown.Item>
//                 <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
//               </NavDropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Image gallery section */}
//       <div className="image-gallery">
//         <h2>Image Gallery</h2>
//         <div className="gallery">
//           {images.map((img, index) => (
//             <img key={index} src={img} alt={`gallery-item-${index}`} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { API_ENDPOINT } from './Api';
import './Dashboard.css';

// Sample product data (image, name, price, etc.)
const products = [
  {
    id: 1,
    image: "V1.jpg", // Image URL
    name: "Product 1",
    price: 200,
  },
  {
    id: 2,
    image: "V2.jpg",
    name: "Product 2",
    price: 300,
  },
  {
    id: 3,
    image: "V3.jpg",
    name: "Product 3",
    price: 500,
  },
  {
    id: 4,
    image: "V4.jpg",
    name: "Product 4",
    price: 600,
  },
  {
    id: 5,
    image: "V5.jpg",
    name: "Product 5",
    price: 400,
  },
  {
    id: 6,
    image: "V6.jpg",
    name: "Product 6",
    price: 350,
  },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Verify if user is in session in local storage
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'));
        setUser(response.data);
        const decoded_token = jwtDecode(response.data.token);
        setUser(decoded_token);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchDecodedUserID();
  }, []);

  // Handles logout method
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Adds item to the cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Renders cart items
  const renderCart = () => {
    return cart.map((item, index) => (
      <div key={index} className="cart-item">
        <img src={item.image} alt={item.name} className="cart-item-image" />
        <div>
          <p>{item.name}</p>
          <p>₱{item.price}</p>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Navbar className='custom-navbar'>
        <Container>
          <Navbar.Brand href="#home">TECH ENTERPRENEUR</Navbar.Brand>
          {/* <Nav.Link href="#users">Users</Nav.Link>c
          <Nav.Link href="#departments">Departments</Nav.Link>
          <Nav.Link href="#courses">Courses</Nav.Link> */}
          <Nav />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
           <Nav.Link href="/logbook">Logbook</Nav.Link>
              <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Shopping Cart Section */}
      <div className="product-gallery">
        <h2>Shop Our Products</h2>
        <div className="gallery">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h5>{product.name}</h5>
                <p>₱{product.price}</p>
                <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Preview Section */}
      <div className="cart-preview">
        <h3>Your Cart</h3>
        {cart.length > 0 ? (
          <div>{renderCart()}</div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
