import React, { useState, useEffect } from 'react';
import './User.css'; 
import backgroundImage from '../images/pro.png';

const UserManagement = ({ onNavigate, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8001/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (index) => {
    const user = users[index];
    try {
      const response = await fetch(`http://localhost:8001/api/users/${user.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (index) => {
    setEditingIndex(index);
    setNewRole(users[index].role);
    setNewUsername(users[index].username);
  };

  const handleSaveRole = async (index) => {
    const user = users[index];
    try {
      const response = await fetch(`http://localhost:8001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          role: newRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUsers = [...users];
      updatedUsers[index].role = newRole;
      updatedUsers[index].username = newUsername;
      setUsers(updatedUsers);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      
      <div className="user-management">
      <div className="nav-buttons">
          <button onClick={() => onNavigate('Dashboard')}>Dashboard</button>
          <button onClick={() => onNavigate('Product')}>Product Management</button>
          <button onClick={onLogout}>Logout</button>
        </div>
        <h2>User Management</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <>
                      <button className="save-btn" onClick={() => handleSaveRole(index)}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditingIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => handleEditUser(index)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteUser(index)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default UserManagement;
