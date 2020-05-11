var router = require('express').Router();
const { Op } = require("sequelize");
const Card = require('../models/card');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, (req, res) => {
    if (req.query.columnIds.length === 0) return res.send([]);

    const colIds = req.query.columnIds.split(',');
    Card.findAll({
        where: {
            column_id: { [Op.in]: colIds }
        }
    }).then(cards => res.send(cards));
});

router.post('/create', checkAuth, (req, res) => {
    Card
        .create({
            title: req.body.title,
            columnIndex: req.body.columnIndex,
            column_id: req.body.columnId
        })
        .then(() => res.send());
});

router.post('/move', checkAuth, (req, res) => {
    const cardIds = req.body.cardData.map(x => x.id);
    Card
        .findAll({
            where: {
                id: { [Op.in]: cardIds }
            }
        })
        .then(cards => {
            for (let i = 0; i < cards.length; i++) {
                const card = req.body.cardData.find(x => x.id === cards[i].id);
                if (card) {
                    cards[i].column_id = card.column_id;
                    cards[i].columnIndex = card.columnIndex;
                    cards[i].save();
                }
            }

            res.send();
        });
});

module.exports = router;