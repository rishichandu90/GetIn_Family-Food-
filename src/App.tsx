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

// Add this at the top of the file, after imports
const STORAGE_KEY = 'public_dishes';
const GIST_ID = process.env.REACT_APP_GIST_ID;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

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
    console.log('Loading dishes...'); // Debug log
    try {
      // Try to fetch from shared storage first
      fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => {
          console.log('Fetch response:', response.status); // Debug log
          return response.json();
        })
        .then(data => {
          console.log('Gist data:', data); // Debug log
          if (data.files && data.files['dishes.json']) {
            const content = data.files['dishes.json'].content;
            console.log('Dishes content:', content); // Debug log
            let allDishes: Dish[] = [];
            
            try {
              const parsedData = JSON.parse(content);
              allDishes = parsedData.dishes || [];
            } catch (e) {
              console.error('Error parsing dishes:', e);
              allDishes = [];
            }

            // Filter dishes based on author if we're on an author-specific page
            if (author) {
              setDishes(allDishes.filter((dish: Dish) => dish.author === author));
            } else {
              // On "All Dishes" page, show all dishes
              setDishes(allDishes);
            }
          } else {
            console.error('No dishes.json file found in Gist');
            setDishes([]);
          }
        })
        .catch(error => {
          console.error('Error fetching dishes:', error);
          // Fallback to localStorage if fetch fails
          const localDishes = localStorage.getItem('public_dishes');
          if (localDishes) {
            const allDishes = JSON.parse(localDishes);
            if (author) {
              setDishes(allDishes.filter((dish: Dish) => dish.author === author));
            } else {
              setDishes(allDishes);
            }
          }
        });
    } catch (error) {
      console.error('Error in loadDishes:', error);
      setDishes([]);
    }
  }, [author]);

  useEffect(() => {
    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Load dishes - this will now always show dishes to everyone
    loadDishes();
  }, [author, loadDishes]); // Add loadDishes to dependencies

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const handleAddDish = async (title: string, description: string, imageUrl: string) => {
    try {
      const newDish: Dish = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        title,
        description,
        imageUrl,
        author: author || 'unknown'
      };

      // First fetch current dishes from Gist
      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        }
      });
      
      const data = await response.json();
      let currentDishes: Dish[] = [];
      
      if (data.files && data.files['dishes.json']) {
        try {
          const content = data.files['dishes.json'].content;
          const parsedData = JSON.parse(content);
          currentDishes = parsedData.dishes || [];
        } catch (e) {
          console.error('Error parsing current dishes:', e);
        }
      }

      // Add new dish to the beginning
      const updatedDishes = [newDish, ...currentDishes];
      
      // Update Gist with new dishes
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          files: {
            'dishes.json': {
              content: JSON.stringify({ dishes: updatedDishes })
            }
          }
        })
      });

      // Also update localStorage for faster local access
      localStorage.setItem('public_dishes', JSON.stringify(updatedDishes));
      
      // Reload dishes to update the display
      loadDishes();
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      const savedDishes = localStorage.getItem('public_dishes');
      if (!savedDishes) return;

      const allDishes = JSON.parse(savedDishes);
      const updatedDishes = allDishes.filter((dish: Dish) => dish.id !== id);
      
      // Save to local storage
      localStorage.setItem('public_dishes', JSON.stringify(updatedDishes));

      // Update shared storage
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            'dishes.json': {
              content: JSON.stringify(updatedDishes)
            }
          }
        })
      });
      
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
