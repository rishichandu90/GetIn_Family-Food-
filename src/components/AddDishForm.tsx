import React, { useState, useRef } from 'react';

interface AddDishFormProps {
  onSubmit: (title: string, description: string, imageUrl: string) => void;
}

const AddDishForm: React.FC<AddDishFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && imageUrl) {
      onSubmit(title, description, imageUrl);
      setTitle('');
      setDescription('');
      setImageUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form className="add-dish-form" onSubmit={handleSubmit}>
      <h3>Add New Dish</h3>
      <div className="form-group">
        <label htmlFor="title">Dish Name:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter dish name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter dish description"
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Dish Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          required
          className="file-input"
        />
        {imageUrl && (
          <div className="image-preview">
            <img src={imageUrl} alt="Preview" />
          </div>
        )}
      </div>
      <button type="submit" className="add-dish-button">Add Dish</button>
    </form>
  );
};

export default AddDishForm; 