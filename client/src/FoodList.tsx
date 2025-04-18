
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Food = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
};

type Props = {
  role?: string;
};

const FoodList: React.FC<Props> = ({ role }) => {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const url = role
      ? `http://localhost:3000/foods/${role}`
      : 'http://localhost:3000/foods';
  
    axios.get(url)
      .then(res => setFoods(res.data))
      .catch(() => console.error('Failed to fetch foods'));
  }, [role]);
  
  return (
    <div>
      <h2>
        {role
          ? `${role[0].toUpperCase() + role.slice(1)}'s Food`
          : 'All Food Items'}
      </h2>
  
      {foods
        .filter(food => !role || food.uploadedBy === role) // ✅ only show relevant items
        .map(food => (
          <div
            key={food._id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <h4>{food.name}</h4>
            <p>{food.description}</p>
            <img
              src={`http://localhost:3000/uploads/${food.imageUrl}`}
              alt={food.name}
              width="200"
            />
          </div>
        ))}
    </div>
  );
  
};

export default FoodList;
