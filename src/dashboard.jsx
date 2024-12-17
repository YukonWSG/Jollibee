import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navbar, Nav, Container, Button, Table, Modal, Form } from 'react-bootstrap';
import { API_ENDPOINT } from './Api.jsx';

import logo from './assets/jollibeelogoderp.png';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // For Update Modal
  const [formData, setFormData] = useState({ fullname: '', username: '', password: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const headers = {
    accept: 'application/json',
    Authorization: localStorage.getItem('token') || '',
  };

  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          const decodedToken = jwtDecode(tokenData);
          setCurrentUser(decodedToken);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };
    fetchDecodedUserID();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}/user`, { headers });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteUser = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => result.isConfirmed);

    if (!isConfirm) return;

    try {
      await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers });
      Swal.fire('Deleted!', 'User has been deleted.', 'success');
      fetchUsers();
    } catch (error) {
      Swal.fire('Error', 'Failed to delete user.', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_ENDPOINT}/user`,
        { fullname: formData.fullname, username: formData.username, password: formData.password },
        { headers }
      );
      Swal.fire('Success', 'User created successfully', 'success');
      fetchUsers();
      setShowCreateModal(false);
    } catch (error) {
      if (error.response.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire('Error', 'Failed to create user.', 'error');
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
  
    try {
      // Sending request with password included
      const response = await axios.put(
        `${API_ENDPOINT}/user/${selectedUser.user_id}`,
        {
          fullname: formData.fullname,
          username: formData.username,
          password: formData.password, // Include the password in the payload
        },
        { headers }
      );
  
      console.log('Response:', response.data);
      Swal.fire('Success', 'User updated successfully', 'success');
      fetchUsers(); // Refresh user list
      setShowUpdateModal(false); // Close the modal
    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
  
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Failed to update user.',
        'error'
      );
    }
  };

  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand>
            <img
                src={logo} alt="Jollibee Logo"
                style={{ width: '50px', height: 'auto', verticalAlign: 'middle', marginRight: '10px' }} 
              />
              Jollibee Employees
              </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Button className="mb-2 float-end" variant="success" onClick={() => setShowCreateModal(true)}>
          Create User
        </Button>
        <Table className="custom-table" bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Fullname</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowReadModal(true);
                    }}
                  >
                    Read
                  </Button>{' '}
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({ fullname: user.fullname, username: user.username, password: '' });
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.user_id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser} className="create-form">
            <Form.Group className="mb-3">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter fullname"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                isInvalid={!!validationErrors.fullname}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.fullname}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                isInvalid={!!validationErrors.username}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                isInvalid={!!validationErrors.password}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Read User Modal */}
      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <p>
                <strong>ID:</strong> {selectedUser.user_id}
              </p>
              <p>
                <strong>Fullname:</strong> {selectedUser.fullname}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
            </>
          ) : (
            <p>No user selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReadModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

          <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateUser} className="create-form">
          <Form.Group className="mb-3">
            <Form.Label>Fullname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter fullname"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              isInvalid={!!validationErrors.fullname}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.fullname}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              isInvalid={!!validationErrors.username}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              isInvalid={!!validationErrors.password}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="warning" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>

    </>
  );
}

export default Dashboard;
