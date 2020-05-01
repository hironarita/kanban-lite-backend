var router = require('express').Router();
const passport = require('passport');

router.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ where: { username } }).then(async user => {
		if (user) return res.status(400).send();
		const newUser = await User.create({ username, password });
		req.login(newUser, () => res.status(200).send());
	});
});

router.post('/login',
	passport.authenticate('login'),
	(req, res) => {
		req.user ? res.status(200).send() : res.status(400).send()
	}
);

const isLoggedIn = function (req, res) {
    req.isAuthenticated() === true
        ? res.send(true)
        : res.send(false);
};
router.get('/isLoggedIn', isLoggedIn);

module.exports = router;