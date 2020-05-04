var router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ where: { username } }).then(async user => {
		if (user) return res.status(400).send();
		const hash = bcrypt.hashSync(password, 10);
		const newUser = await User.create({ username, password: hash });
		req.login(newUser, () => res.status(200).send());
	});
});

router.post('/login',
	passport.authenticate('login'),
	(req, res) => {
        req.user
            ? res.status(200).send()
            : res.status(400).send()
	}
);

router.get('/isLoggedIn', (req, res) => req.isAuthenticated() === true
    ? res.send(true)
    : res.send(false)
);

router.get('/logout', (req, res) => {
    req.logout();
    res.send();
});

module.exports = router;