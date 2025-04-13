import React from 'react';

interface FoodCardProps {
  date: string;
  title: string;
  description: string;
  isAdmin: boolean;
  onDelete?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ date, title, description, isAdmin, onDelete }) => {
  return (
    <div className="food-card">
      <div className="card-header">
        <span className="date">{date}</span>
        {isAdmin && onDelete && (
          <button className="delete-btn" onClick={onDelete}>Delete</button>
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FoodCard; 