import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { API_ENDPOINT } from './Api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();

  const headers = {
    accept: 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))?.data?.token || '',
  };

  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('token'));
        if (tokenData) {
          const decodedToken = jwtDecode(tokenData.data.token);
          setUser(decodedToken);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}/user`, { headers });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
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

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_ENDPOINT}/user`,
        { fullname, username, password },
        { headers }
      );
      Swal.fire('Success', 'User created successfully', 'success');
      fetchUsers();
      handleClose();
    } catch (error) {
      if (error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire('Error', 'Failed to create user.', 'error');
      }
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = (rowUser) => {
    setSelectedUser(rowUser);
    setShow1(true);
  };

  return (
    <>
      <Navbar bg="success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Naga College Foundation, Inc.</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#users">Users</Nav.Link>
            <Nav.Link href="#departments">Departments</Nav.Link>
            <Nav.Link href="#courses">Courses</Nav.Link>
          </Nav>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title={user ? `User: ${user.username}` : 'Dropdown'}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-3">
        <Button className="mb-2 float-end" variant="success" onClick={handleShow}>
          Create User
        </Button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Fullname</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.user_id}>
                <td>{row.user_id}</td>
                <td>{row.username}</td>
                <td>{row.fullname}</td>
                <td>
                  <Button size="sm" variant="secondary" onClick={() => handleShow1(row)}>
                    Read
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteUser(row.user_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createUser}>
            <Form.Group>
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="mt-3" type="submit" variant="primary">
              Save
            </Button>
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
            </div>
          ) : (
            <p>No data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
