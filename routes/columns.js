var router = require('express').Router();
const Column = require('../models/column');
const Card = require('../models/card');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, (req, res) => {
    Column
        .findAll({ where: { user_id: req.user.dataValues.id } })
        .then(columns => res.send(columns));
});

router.post('/create', checkAuth, (req, res) => {
    Column
        .create({
            title: req.body.title,
            boardIndex: req.body.boardIndex,
            user_id: req.user.dataValues.id
        })
        .then(() => res.send());
});

router.post('/update', checkAuth, (req, res) => {
    Column
        .findOne({ where: { id: req.body.id } })
        .then(async column => {
            column.title = req.body.title;
            await column.save();
            res.send();
        });
});

router.post('/move', checkAuth, (req, res) => {
    Column
        .findAll({ where: { user_id: req.user.dataValues.id } })
        .then(async columns => {
            for (let i = 0; i < columns.length; i++) {
                columns[i].boardIndex = req.body[columns[i].id];
                await columns[i].save();
            }

            res.send();
        });
});

router.post('/delete/:id', checkAuth, async (req, res) => {
    await Card.destroy({ where: { column_id: req.params.id } })

    Column
        .destroy({ where: { id: req.params.id } })
        .then(() => res.send());
});

module.exports = router;