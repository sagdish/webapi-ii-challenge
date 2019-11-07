const express = require('express');
const cors = require('cors');

const postRouter = require('./postRouter');

const server = express();
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json("API is running");
});

server.use('/api/posts', postRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\n === server is running on port ${PORT} === \n`);
});
