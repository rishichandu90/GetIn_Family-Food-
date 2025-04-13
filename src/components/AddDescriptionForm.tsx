import React, { useState } from 'react';

interface AddDescriptionFormProps {
  onSubmit: (title: string, description: string) => void;
}

const AddDescriptionForm: React.FC<AddDescriptionFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="add-description-form" onSubmit={handleSubmit}>
      <h3>Add Daily Special</h3>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Description</button>
    </form>
  );
};

export default AddDescriptionForm; 