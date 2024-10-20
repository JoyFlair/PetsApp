"use client"
import axios from "axios";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Container, Form, Button, Card } from 'react-bootstrap';
import Link from "next/link";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost/petsApi/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.success);
        setError('');

        localStorage.setItem('username', username);

        router.push('/main'); 
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-3">Login  Web App</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="mb-3"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 custom-btn mb-2"
              style={{ borderRadius: '20px' }}
            >
              Login
            </Button>
            No Account Yet? <Link href={'./register'} style={{ color: 'red' }}>Register</Link>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
