const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(session({
	secret: "cats",
	resave: false,
	saveUninitialized: false
}));

exports.app = app;

const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PW, {
	host: 'localhost',
	dialect: 'postgres',
	port: process.env.POSTGRES_PORT
});
exports.sequelize = sequelize;

// models
const User = require('./models/User').User;
User.sync();

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	User.findOne({ where: { id } }).then(user => done(null, user));
});

app.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ where: { username } }).then(async user => {
		if (user) return res.status(400).send();
		await User.create({ username, password });
		res.status(200).send();
	});
});

passport.use(new LocalStrategy((username, password, done) => {
	User.findOne({ where: { username } }).then(user => {
		if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
		}
		if (user.password !== password) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user);
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
	passport.authenticate('local'),
	(req, res) => req.user ? res.status(200).send() : res.status(400).send()
);

app.listen(process.env.PORT);