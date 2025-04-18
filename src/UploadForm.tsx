
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vibe || !image) {
      return setMessage('Please fill out all fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', vibe);
    formData.append('uploadedBy', category);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:3000/upload', formData);
      setMessage('✅ Food item uploaded successfully!');
      setName('');
      setVibe('');
      setImage(null);
    } catch (err) {
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload a Food Item</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Food Name" value={name} onChange={e => setName(e.target.value)} required /><br />
        <input type="text" placeholder="Today's Vibe" value={vibe} onChange={e => setVibe(e.target.value)} required /><br />
        <select value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="amma">Amma's Food</option>
          <option value="rishi">Rishi's Food</option>
          <option value="atthamma">Atthamma's Food</option>
        </select><br />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required /><br />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadForm;
