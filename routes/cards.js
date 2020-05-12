var router = require('express').Router();
const { Op } = require("sequelize");
const Card = require('../models/card');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, async (req, res) => {
    if (req.query.columnIds.length === 0) return res.send([]);

    const colIds = req.query.columnIds.split(',');
    const cards = await Card.findAll({ where: { column_id: { [Op.in]: colIds } } });
    res.send(cards);
});

router.get('/card/:id', checkAuth, async (req, res) => {
    const card = await Card.findOne({ where: { id: req.params.id } });
    res.send(card);
});

router.post('/create', checkAuth, async (req, res) => {
    await Card.create({
        title: req.body.title,
        columnIndex: req.body.columnIndex,
        column_id: req.body.columnId
    })
    res.send();
});

router.post('/update/:id', checkAuth, async (req, res) => {
    const card = await Card.findOne({ where: { id: req.params.id } });
    card.title = req.body.title;
    card.description = req.body.description;
    await card.save();
    res.send();
});

router.post('/move', checkAuth, async (req, res) => {
    const cardIds = req.body.cardData.map(x => x.id);
    const cards = await Card.findAll({ where: { id: { [Op.in]: cardIds } } });
    for (let i = 0; i < cards.length; i++) {
        const card = req.body.cardData.find(x => x.id === cards[i].id);
        if (card) {
            cards[i].column_id = card.column_id;
            cards[i].columnIndex = card.columnIndex;
            await cards[i].save();
        }
    }

    res.send();
});

module.exports = router;