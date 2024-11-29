import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

// Pages
import Dashboard from './components/Dashboard';
import Product from './components/Product';
import UserManagement from './components/UserManagement';
import Login from './components/Login';

import wingsImage from './images/e-shop.png';

const App = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState('Dashboard');
    const [Products, setProducts] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // +++++ Changed endpoint to "/users" to match the backend route +++++
                const response = await fetch("http://localhost:8001/users"); 
                if (!response.ok) {
                    throw new Error('Could not fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8001/products");
                if (!response.ok) {
                    throw new Error('Could not fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // eslint-disable-next-line no-unused-vars
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // +++++ 
            const response = await fetch("http://localhost:8001/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name, email }),
            });
            if (!response.ok) {
                throw new Error('Error adding user');
            }
            const newUser = await response.json();
            setUsers([...users, newUser]);
            setName("");
            setEmail("");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const style = {
        backgroundImage: `url(${wingsImage})`, // +++++ 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setCurrentView('Dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentView('Login');
    };

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} users={users} setUsers={setUsers} />;
    }

    return (
        <Router>
            <header className="app-header" style={style}>
                <a href="#!" className="logo">W <span>ings C</span>afe Inventory System</a>
                <div className="app-container">
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} users={users} setUsers={setUsers} />} />
                        <Route path="/dashboard" element={
                            <Dashboard
                                Products={Products}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        } />
                        <Route path="/product" element={
                            <Product
                                Products={Products}
                                setProducts={setProducts}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        } />
                        <Route path="/user-management" element={
                            <UserManagement
                                users={users}
                                setUsers={setUsers}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        } />
                    </Routes>

                    <div className="content">
                        {currentView === 'Dashboard' && (
                            <Dashboard
                                Products={Products}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        )}
                        {currentView === 'Product' && (
                            <Product
                                Products={Products}
                                setProducts={setProducts}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        )}
                        {currentView === 'UserManagement' && (
                            <UserManagement
                                users={users}
                                setUsers={setUsers}
                                onNavigate={handleNavigate}
                                onLogout={handleLogout}
                            />
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            marginTop: '20px'
                        }}>
                            <img src="../aa.jpg" alt="Drinks" style={{
                                width: '200px',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                            }} />
                            <img src="../bb.jpg" alt="Fast Food" style={{
                                width: '200px',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                            }} />
                        </div>
                    </div>
                </div>
            </header>
        </Router>
    );
};

export default App;
