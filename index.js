const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

exports.app = app;

const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PW, {
	host: 'localhost',
	dialect: 'postgres',
	port: process.env.POSTGRES_PORT
});
exports.sequelize = sequelize;

// models
const User = require('./models/User').User;
User.sync({ force: true });

app.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ where: { username } }).then(user => {
		if (user) return res.status(400).send();
		User.create({ username, password });
		res.status(200).send();
	});
});

app.listen(process.env.PORT);