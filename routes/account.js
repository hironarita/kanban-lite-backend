var router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Column = require('../models/column');

router.get('/isLoggedIn', (req, res) => req.isAuthenticated() === true
	? res.send(true)
	: res.send(false)
);

router.get('/logout', (req, res) => {
	req.logout();
	res.send();
});

router.post('/register', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await User.findOne({ where: { username } })
	if (user) return res.status(400).send();
	const hash = bcrypt.hashSync(password, 10);
	const newUser = await User.create({ username, password: hash });

	// initialize the user with 2 columns - To Do and Completed
	await Column.create({ title: 'To Do', boardIndex: 0, user_id: newUser.id });
	await Column.create({ title: 'Completed', boardIndex: 1, user_id: newUser.id });

	req.login(newUser, () => res.status(200).send());
});

router.post('/login',
	passport.authenticate('login'),
	(req, res) => {
		req.user
			? res.status(200).send()
			: res.status(400).send()
	}
);

module.exports = router;