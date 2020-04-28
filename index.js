const express = require('express');
const app = express();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PW, {
	host: 'localhost',
	dialect: 'postgres',
	port: process.env.POSTGRES_PORT
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.PORT);