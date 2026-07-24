require('dotenv').config();

const express = require('express');
const app = express();
// const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('This is my request handling')
})

app.get('/login', (req, res) => {
    res.send('<h1>login on chai or code</h1>')
})

app.get('/youtube', (req,res) => {
    res.send('<h2>hello this is my page for YouTube</h2>')
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});