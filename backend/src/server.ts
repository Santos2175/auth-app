import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
