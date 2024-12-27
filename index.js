const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', userRoutes);

app.get('/', (req, res) => { 
    res.send('Welcome to the home page');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});