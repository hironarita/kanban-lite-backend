var router = require('express').Router();
const Column = require('../models/column');
const Card = require('../models/card');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, async (req, res) => {
    const columns = await Column.findAll({ where: { user_id: req.user.dataValues.id } })
    res.send(columns);
});

router.post('/create', checkAuth, async (req, res) => {
    await Column.create({
        title: req.body.title,
        boardIndex: req.body.boardIndex,
        user_id: req.user.dataValues.id
    });
    res.send();
});

router.post('/update', checkAuth, async (req, res) => {
    const column = await Column.findOne({ where: { id: req.body.id } })
    column.title = req.body.title;
    await column.save();
    res.send();
});

router.post('/move', checkAuth, async (req, res) => {
    const columns = Column.findAll({ where: { user_id: req.user.dataValues.id } })
    for (let i = 0; i < columns.length; i++) {
        columns[i].boardIndex = req.body[columns[i].id];
        await columns[i].save();
    }

    res.send();
});

router.post('/delete/:id', checkAuth, async (req, res) => {
    await Card.destroy({ where: { column_id: req.params.id } });
    await Column.destroy({ where: { id: req.params.id } });
    res.send();
});

module.exports = router;