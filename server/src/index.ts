
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema and model
const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', FoodSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /upload
app.post('/upload', upload.single('image'), async (req, res) => {
  const { name, description, uploadedBy } = req.body;
  const imageUrl = req.file?.filename;

  if (!name || !description || !uploadedBy || !imageUrl) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newFood = await Food.create({ name, description, imageUrl, uploadedBy });
    res.status(201).json({ message: 'Food added', food: newFood });
  } catch (error) {
    res.status(500).json({ error: 'Error saving to database' });
  }
});

// GET /foods
app.get('/foods', async (_req, res) => {
  try {
    const foods = await Food.find().sort({ uploadedAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:\${PORT}`));
