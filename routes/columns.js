var router = require('express').Router();
const Column = require('../models/column');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, (req, res) => {
    Column.findAll({ where: { user_id: req.user.dataValues.id } }).then(columns => res.send(columns));
});

router.post('/create', checkAuth, (req, res) => {
    Column.create({
        title: req.body.title,
        boardIndex: req.body.boardIndex,
        user_id: req.user.dataValues.id 
    }).then(() => res.send());
});

router.post('/update', checkAuth, (req, res) => {
    Column.findOne({ where: { id: req.body.id } }).then(async column => {
        column.title = req.body.title;
        await column.save();
        res.send();
    });
});

module.exports = router;