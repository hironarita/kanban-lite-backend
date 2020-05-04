var router = require('express').Router();
const Column = require('../models/column');

router.get('/', (req, res, next) => req.isAuthenticated() === true ? next() : res.status(401).send(), (req, res) => {
    Column.findAll({ where: { user_id: req.user.dataValues.id } }).then(columns => res.send(columns));
});

module.exports = router;