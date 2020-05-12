const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	const user = await User.findOne({ where: { id } });
	done(null, user);
});

passport.use('login', new LocalStrategy(async (username, password, done) => {
	const user = await User.findOne({ where: { username } });
	if (!user) {
		return done(null, false, { message: 'Incorrect username.' });
	}
	if (bcrypt.compareSync(password, user.password) === false) {
		return done(null, false, { message: 'Incorrect password.' });
	}
	return done(null, user);
}));

module.exports = passport;