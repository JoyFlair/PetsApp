'use client'
import React, { useState } from 'react';
import Link from "next/link";

function RegisterForm({ onBack }) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/petsApi/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
          full_name: fullName,
        }).toString(),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setSuccess('Registration successful! You can now log in.');
        setUsername('');
        setPassword('');
        setFullName('');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
      <button onClick={onBack} style={{ marginTop: '10px' }}>Back</button> {/* Back button */}

      Have a account? <Link href={'/'} style={{color: 'green'}}>Login</Link>
    </div>
  );
}

export default RegisterForm;
