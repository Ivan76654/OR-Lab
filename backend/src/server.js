const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Routes
const homeRouter = require('./routes/home.routes');
const downloadRouter = require('./routes/download.routes');

const app = express();

const host = process.env.HOST;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRouter);
app.use('/download', downloadRouter);

app.listen(port, () => {
	console.log(`Server running on: http://${host}:${port}/`);
});

