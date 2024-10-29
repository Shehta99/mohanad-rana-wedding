import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaTasks, FaBoxOpen, FaTruck, FaCalculator } from 'react-icons/fa';
import logo from './assets/checklist.png';
import Preparation from './Preparation/PreparationCard';
import Deloder from './Deloder/Deloder';
import InventoryHome from './Home';
import Calculation from './Calculation/Calculation';
import './App.css';
import StockTake from './Stock/StockTake';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar
          expand="lg"
          fixed="top"
          style={{
            backgroundColor: '#563d7c',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '8px 20px', // Adjusted padding for better layout
          }}
          variant="dark"
          className="my-3 mx-3"
        >
          <Container fluid>
            <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logo}
                width="40"
                height="40"
                className="d-inline-block align-top me-2"
                alt="Inventory Logo"
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Inventory</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="gap-3">
                <Nav.Link
                  as={Link}
                  to="/preparation"
                  className="nav-link"
                  style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                >
                  <FaTasks style={{ marginRight: '5px' }} />
                  Preparation
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/stock"
                  className="nav-link"
                  style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                >
                  <FaBoxOpen style={{ marginRight: '5px' }} />
                  Stock Take
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/deloder"
                  className="nav-link"
                  style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                >
                  <FaTruck style={{ marginRight: '5px' }} />
                  Deloder
                </Nav.Link>
                <Nav.Link
                  href="/calc"
                  className="nav-link"
                  style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                >
                  <FaCalculator style={{ marginRight: '5px' }} />
                  Calculation
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <br/><br/>
        <div style={{ paddingTop: '80px' }}>
          {/* Top padding added to avoid overlap due to fixed navbar */}
          <Routes>
            <Route path="/" element={<InventoryHome />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/deloder" element={<Deloder />} />
            <Route path="/calc" element={<Calculation />} />
            <Route path="/stock" element={<StockTake />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
