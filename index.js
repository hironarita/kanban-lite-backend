const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});  

app.use(session({
	secret: "cats",
	resave: false,
	saveUninitialized: false
}));
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

passport.use('login', new LocalStrategy((username, password, done) => {
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

app.post('/login',
	passport.authenticate('login'),
	(req, res) => {
		req.user ? res.status(200).send() : res.status(400).send()
	}
);

const isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
};

app.get('/isLoggedIn', isLoggedIn, (req, res) => res.send(req.user));

app.listen(process.env.SERVER_PORT);