const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json()); 

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connection established successfully!"))
  .catch(err => console.log("MongoDB connection error:", err));


const componentsRouter = require('./routes/components');
const buildsRouter = require('./routes/builds');
app.use('/api/components', componentsRouter);
app.use('/api/builds', buildsRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the PC-Forge API!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});