import React from 'react';

interface DishCardProps {
  id: string;
  date: string;
  imageUrl: string;
  title: string;
  description: string;
  isAdmin: boolean;
  onDelete?: () => void;
}

const DishCard: React.FC<DishCardProps> = ({ date, imageUrl, title, description, isAdmin, onDelete }) => {
  return (
    <div className="dish-card">
      <div className="dish-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="dish-info">
        <div className="dish-header">
          <h3>{title}</h3>
          <span className="date">{date}</span>
        </div>
        <p className="dish-description">{description}</p>
        {isAdmin && onDelete && (
          <button className="delete-btn" onClick={onDelete}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default DishCard; 