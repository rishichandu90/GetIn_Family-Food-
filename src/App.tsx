import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import DishCard from './components/DishCard';
import AddDishForm from './components/AddDishForm';
import Login from './components/Login';

interface Dish {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
}

// Add these constants at the top after imports
const BIN_ID = '65f2c0c8dc74654018a1c3c7';
const API_KEY = '$2a$10$Gy5Hy4Hy4Hy4Hy4Hy4Hy4';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Home Page Component
const Home = () => {
  return (
    <div className="home-layout">
      <div className="hero">
        <h1>Delicious Food</h1>
        <p className="subtitle">Discover authentic homemade dishes from our family kitchen</p>
        <Link to="/all-dishes" className="cta-button">Explore Our Dishes</Link>
      </div>
    </div>
  );
};

// Generic Dishes Page Component
const DishesPage = ({ title, author }: { title: string, author?: string }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to load dishes
  const loadDishes = useCallback(() => {
    fetch(JSONBIN_URL, {
      headers: {
        'X-Master-Key': API_KEY
      }
    })
      .then(response => response.json())
      .then(data => {
        const allDishes = data.record.dishes || [];
        if (author) {
          setDishes(allDishes.filter((dish: Dish) => dish.author === author));
        } else {
          setDishes(allDishes);
        }
      })
      .catch(error => {
        console.error('Error loading dishes:', error);
        setDishes([]);
      });
  }, [author]);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    loadDishes();
  }, [loadDishes]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const handleAddDish = async (title: string, description: string, imageUrl: string) => {
    try {
      // First get current dishes
      const response = await fetch(JSONBIN_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      const data = await response.json();
      const currentDishes = data.record.dishes || [];

      // Add new dish
      const newDish: Dish = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        title,
        description,
        imageUrl,
        author: author || 'unknown'
      };

      const updatedDishes = [newDish, ...currentDishes];

      // Update JSONBin
      await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ dishes: updatedDishes })
      });

      loadDishes();
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      // Get current dishes
      const response = await fetch(JSONBIN_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      const data = await response.json();
      const currentDishes = data.record.dishes || [];

      // Remove the dish
      const updatedDishes = currentDishes.filter((dish: Dish) => dish.id !== id);

      // Update JSONBin
      await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ dishes: updatedDishes })
      });

      loadDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  return (
    <div className="dishes-page">
      <div className="page-header">
        <h2>{title}</h2>
        {isAdmin && (
          <div className="admin-controls">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Only show Add Dish form on author-specific pages when admin is logged in */}
      {isAdmin && author && <AddDishForm onSubmit={handleAddDish} />}

      <div className="dishes-container">
        {dishes.length === 0 ? (
          <p className="no-dishes">No dishes available yet.</p>
        ) : (
          dishes.map(dish => (
            <DishCard
              key={dish.id}
              id={dish.id}
              date={dish.date}
              title={dish.title}
              description={dish.description}
              imageUrl={dish.imageUrl}
              isAdmin={isAdmin}
              onDelete={() => handleDeleteDish(dish.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// About Page Component
const About = () => (
  <div className="about-page">
    <h2>About Us</h2>
    <p>Welcome to our food journey!</p>
    <div className="social-links">
      <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
    </div>
  </div>
);

function App() {
  return (
    <Router basename="/GetIn_Family-Food-">
      <div className="App">
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/all-dishes">All Dishes</Link>
          <Link to="/rishi-dishes">Rishi's Dishes</Link>
          <Link to="/atthamma-dishes">Atthamma's Dishes</Link>
          <Link to="/amma-dishes">Amma's Dishes</Link>
          <Link to="/about">About</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/all-dishes" element={<DishesPage title="All Dishes" />} />
          <Route path="/rishi-dishes" element={<DishesPage title="Rishi's Dishes" author="rishi" />} />
          <Route path="/atthamma-dishes" element={<DishesPage title="Atthamma's Dishes" author="atthamma" />} />
          <Route path="/amma-dishes" element={<DishesPage title="Amma's Dishes" author="amma" />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
