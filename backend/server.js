require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');


const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
