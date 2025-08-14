require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');

db(); 


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/blogs', blogRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});