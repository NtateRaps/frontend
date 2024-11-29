import './Dashboard.css';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import burger11 from '../images/burger-11.jpg'; 
import burger12 from '../images/burger-12.jpg';
import brand181 from '../images/brand-181.png';

const Dashboard = ({ onNavigate, onLogout }) => {
  const [Products, setProducts] = useState([]);
  const totalProducts = Products.length;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8001/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Extract product names and quantities from Products for chart data
  const productNames = Products.map(product => product.name);
  const quantities = Products.map(product => product.quantity);

  // Set up chart options and series based on the product data
  const chartOptions = {
    chart: {
      id: "basic-bar",
      background: 'rgba(255, 255, 255, 0.8)', // Light background to contrast with chart colors
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 5, // Rounded bars for a smoother look
        horizontal: false,
        columnWidth: '55%',
        startingShape: 'flat',
      }
    },
    xaxis: {
      categories: productNames.length ? productNames : ['No Data'],
      labels: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          colors: '#333', // Darker color for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          colors: '#333', // Darker color for y-axis labels
        },
      },
    },
    title: {
      text: 'Product Quantities by Product Name',
      align: 'center',
      style: {
        fontSize: '22px',
        color: '#FF5733', // Warm color for title (Food-related theme)
        fontWeight: 'bold',
      },
    },
    fill: {
      colors: ['#FF5733', '#FFC300'], // Warm, food-related colors for the bars
    },
    grid: {
      borderColor: '#ddd', // Light grid lines to avoid distraction
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: { show: true },
      y: { formatter: (val) => `Quantity: ${val}` },
    },
  };

  const chartSeries = [{
    name: "Quantity",
    data: quantities.length ? quantities : [0]
  }];

  return (
    <div className="Dashboard-header" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px' }}>
      <div className="Dashboard-buttons">
        <button className="btn" onClick={() => onNavigate('Product')}>
          Product Management
        </button>
        <button className="btn" onClick={() => onNavigate('UserManagement')}>
          User Management
        </button>
        <button className="btn logout" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div>
        <img src={brand181} alt="brand-181.png" className="rotating-image" />
        <h2 style={{ fontSize: '32px', color: '#FF5733', fontWeight: 'bold' }}>Dashboard</h2>
        <div className="chart-container" style={{ marginTop: '30px' }}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="400" 
            height="400" 
          />
        </div>
      </div>
      <div className="Dashboard-content" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '5px' }}>
        <p className="Dashboard-total" style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
          Total Products: {totalProducts}
        </p>
      </div>
      <div className="image-container" style={{ marginTop: '20px' }}>
        <img src={burger11} alt="Burger 11" className="rotating-image" />
        <img src={burger12} alt="Burger 12" className="rotating-image" />
      </div>
    </div>
  );
};

export default Dashboard;
