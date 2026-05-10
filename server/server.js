const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const objectRoutes = require('./routes/objectRoutes');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*'}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.get('/', (req,res)=>res.json({message:'3D MERN API running'}));
app.use('/api/auth', authRoutes);
app.use('/api/objects', objectRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('MongoDB connected');
  app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
}).catch(err=>{console.error('DB error',err.message); process.exit(1)});
