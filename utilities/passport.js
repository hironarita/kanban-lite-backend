const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	User.findOne({ where: { id } }).then(user => done(null, user));
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

module.exports = passport;