import React, { useState, useEffect } from 'react';
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

// Add this at the top of the file, after imports
const STORAGE_KEY = 'public_dishes';

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
  const loadDishes = () => {
    try {
      // Always get dishes from localStorage
      const savedDishes = localStorage.getItem('public_dishes');
      let allDishes: Dish[] = [];
      
      if (savedDishes) {
        allDishes = JSON.parse(savedDishes);
      }

      // Filter dishes based on author if we're on an author-specific page
      if (author) {
        setDishes(allDishes.filter(dish => dish.author === author));
      } else {
        // On "All Dishes" page, show all dishes
        setDishes(allDishes);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      setDishes([]);
    }
  };

  useEffect(() => {
    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Load dishes - this will now always show dishes to everyone
    loadDishes();
  }, [author]); // Reload when author changes

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const handleAddDish = (title: string, description: string, imageUrl: string) => {
    try {
      const newDish: Dish = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        title,
        description,
        imageUrl,
        author: author || 'unknown'
      };

      // Get current dishes from public storage
      const savedDishes = localStorage.getItem('public_dishes');
      const allDishes: Dish[] = savedDishes ? JSON.parse(savedDishes) : [];
      
      // Add new dish to the beginning
      const updatedDishes = [newDish, ...allDishes];
      
      // Save to public storage
      localStorage.setItem('public_dishes', JSON.stringify(updatedDishes));
      
      // Reload dishes to update the display
      loadDishes();
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  const handleDeleteDish = (id: string) => {
    try {
      const savedDishes = localStorage.getItem('public_dishes');
      if (!savedDishes) return;

      const allDishes = JSON.parse(savedDishes);
      const updatedDishes = allDishes.filter((dish: Dish) => dish.id !== id);
      
      // Save updated list to public storage
      localStorage.setItem('public_dishes', JSON.stringify(updatedDishes));
      
      // Reload dishes
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
