const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PW, {
	host: 'localhost',
	dialect: 'postgres',
	port: process.env.POSTGRES_PORT
});

exports.sequelize = sequelize;

sequelize
	.authenticate()
	.then(() => console.log('Connection has been established successfully.'))
	.catch(err => console.error('Unable to connect to the database:', err));

const User = require('./models/User').User;

User.sync();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.post('/register', (req, res) => console.log(req.body));

app.listen(process.env.PORT);