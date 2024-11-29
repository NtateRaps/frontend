import React, { useState } from 'react';
import { RiUserStarFill } from "react-icons/ri"; 
import { GiKeyLock } from "react-icons/gi";
import './Login.css';
import wingsImage from '../images/burger-16.jpg';
import brandLogo1 from '../images/brand-181.png';
import brandLogo from '../images/brand-18.PNG';

const Login = ({ onLogin, users, setUsers }) => {
  const style = {
    backgroundImage: `url(${wingsImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8001/users");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const user = data.find(user => user.username === username && user.password === password);
      if (user) {
        setStatus("Login successful!");
        onLogin();
      } else {
        setStatus("Invalid username or password.");
      }
    } catch (error) {
      setStatus("Error logging in.");
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    // Do not allow user to sign up with empty username and password
    if (!username || !password) {
      setStatus('Username and password are required.');
      return;
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
      setStatus('Username already exists.');
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role: 'user' }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const newUser = { username, password, role: 'user' };
      setUsers([...users, newUser]);
      setStatus("Signup successful!");
    } catch (error) {
      setStatus("Error signing up.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div style={style}> 
      <div className='wrapper'>
        <img src={brandLogo1} alt="Brand Logo" style={{ width: '300px', marginBottom: '-100px' }} />
        <h2>Login / Sign Up</h2>
        <p>{status}</p>
        <div className="input-box">
          <label>
            <input 
              type="text" 
              placeholder="Username" 
              required 
              onChange={e => setUsername(e.target.value)} 
              value={username} 
            />
            <RiUserStarFill className='icons'/>
          </label>
        </div>
        <div className="input-box">
          <label>
            <input 
              type="password" 
              placeholder="Password" 
              required 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
            />
            <GiKeyLock className='icons'/>
          </label>
        </div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Sign Up</button>
        <img src={brandLogo} alt="Brand Logo" style={{ width: '100px', marginBottom: '20px' }} />
      </div>
    </div>
  );
};

export default Login;