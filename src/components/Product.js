import React, { useState, useEffect } from 'react';
import './Product.css';

const Product = ({ Products, setProducts, onNavigate, onLogout }) => {
  const [ProductName, setProductName] = useState('');
  const [ProductDescription, setProductDescription] = useState('');
  const [ProductCategory, setProductCategory] = useState('');
  const [ProductPrice, setProductPrice] = useState(0);
  const [ProductQuantity, setProductQuantity] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8001/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = { 
      name: ProductName, 
      description: ProductDescription, 
      category: ProductCategory, 
      price: ProductPrice, 
      quantity: ProductQuantity 
    };

    try {
      const response = await fetch("http://localhost:8001/products", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const result = await response.json();
      const addedProduct = { ...newProduct, id: result.insertId };
      setProducts([...Products, addedProduct]);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const updatedProduct = { 
      name: ProductName, 
      description: ProductDescription, 
      category: ProductCategory, 
      price: ProductPrice, 
      quantity: ProductQuantity 
    };

    if (editingIndex !== null) {
      try {
        const response = await fetch(`http://localhost:8001/products/${Products[editingIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProducts = [...Products];
        updatedProducts[editingIndex] = { ...updatedProduct, id: Products[editingIndex].id };
        setProducts(updatedProducts);
        setEditingIndex(null);
        resetForm();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleEditProduct = (index) => {
    const product = Products[index];
    setProductName(product.name);
    setProductDescription(product.description);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductQuantity(product.quantity);
    setEditingIndex(index);
  };

  const handleSellProduct = async (index) => {
    const product = Products[index];
    if (product.quantity > 0) {
      const updatedQuantity = product.quantity - 1;

      try {
        const response = await fetch(`http://localhost:8001/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...product,
            quantity: updatedQuantity,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sell product');
        }

        const updatedProducts = [...Products];
        updatedProducts[index] = { ...product, quantity: updatedQuantity };
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error selling product:", error);
      }
    } else {
      alert("Product is out of stock!");
    }
  };

  const handleDeleteProduct = async (index) => {
    const product = Products[index];
    try {
      const response = await fetch(`http://localhost:8001/products/${product.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(Products.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductCategory('');
    setProductPrice(0);
    setProductQuantity(0);
  };

  return (
    <div className="Product-management-container">
      <div className="Product-management-buttons">
        <button className="btn" onClick={() => onNavigate('Dashboard')}>Dashboard</button>
        <button className="btn" onClick={() => onNavigate('UserManagement')}>User Management</button>
        <button className="btn logout" onClick={onLogout}>Logout</button>
      </div>
      <h2>Product Management</h2>

      <form className="Product-form" onSubmit={editingIndex !== null ? handleUpdateProduct : handleAddProduct}>
        <div className="form-group">
          <label>Product Name:</label>
          <input type="text" value={ProductName} onChange={e => setProductName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={ProductDescription} onChange={e => setProductDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" value={ProductCategory} onChange={e => setProductCategory(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" value={ProductPrice} onChange={e => setProductPrice(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" value={ProductQuantity} onChange={e => setProductQuantity(Number(e.target.value))} />
        </div>
        <button className="btn" type="submit">
          {editingIndex !== null ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <h3>Product List</h3>
      {Products.length > 0 ? (
        <table className="Product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((Product, index) => (
              <tr key={Product.id}>
                <td>{Product.name}</td>
                <td>{Product.description}</td>
                <td>{Product.category}</td>
                <td>M{Number(Product.price).toFixed(2)}</td>
                <td>{Product.quantity}</td>
                <td>
                  <button className="action-btn" onClick={() => handleEditProduct(index)}>Edit</button>
                  <button className="action-btn" onClick={() => handleSellProduct(index)}>Sell</button>
                  <button className="action-btn delete" onClick={() => handleDeleteProduct(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Products added yet.</p>
      )}
    </div>
  );
};

export default Product;
