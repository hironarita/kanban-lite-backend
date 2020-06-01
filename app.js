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
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
let sess = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {}
};
if (process.env.ENVIRONMENT === 'production') {
	app.set('trust proxy', 1);
	sess.cookie.sameSite = 'none';
	sess.cookie.secure = true;
}
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
exports.app = app;

// initialize db
const sequelize = new Sequelize(process.env.DATABASE_URL);
exports.sequelize = sequelize;

// models
(async () => {
	const User = require('./models/user');
	await User.sync();
	const Column = require('./models/column');
	await Column.sync();
	const Card = require('./models/card');
	await Card.sync();
})();

// must come after User model is initialized
require('./utilities/passport');

// routes
app.use('/account', require('./routes/account'));
app.use('/columns', require('./routes/columns'));
app.use('/cards', require('./routes/cards'));

app.listen(process.env.PORT);