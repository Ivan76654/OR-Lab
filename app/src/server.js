const express = require('express');
const path = require('path');

require('dotenv').config();

// Routes
const homeRouter = require('./routes/home.routes');

const app = express();

const host = process.env.HOST;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRouter);

app.listen(port, () => {
	console.log(`Server running on: http://${host}:${port}/`);
});

