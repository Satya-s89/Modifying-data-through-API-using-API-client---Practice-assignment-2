const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
require('dotenv').config();
const MenuItem = require('./schema');

const app = express();
const port = 3010;

app.use(express.static('static'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true,})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


app.put('/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).send('Menu item not found');
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send(`Error updating item: ${err.message}`);
  }
});


app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).send('Menu item not found');
    res.send({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).send(`Error deleting item: ${err.message}`);
  }
});


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


