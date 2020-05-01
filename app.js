const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
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

// initialize db
const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PW, {
	host: 'localhost',
	dialect: 'postgres',
	port: process.env.POSTGRES_PORT
});
exports.sequelize = sequelize;

// models
const User = require('./models/user');
User.sync();

// must come after User model is initialized
require('./utilities/passport');

// routes
app.use('/account', require('./routes/account'));

app.listen(process.env.SERVER_PORT);