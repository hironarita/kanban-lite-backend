var router = require('express').Router();
const { Op } = require("sequelize");
const Card = require('../models/card');

const checkAuth = (req, res, next) => req.isAuthenticated() === true
    ? next()
    : res.status(401).send();

router.get('/', checkAuth, (req, res) => {
    const colIds = req.query.columnIds.split(',');
    Card.findAll({
        where: {
            column_id: { [Op.in]: colIds }
        } 
    }).then(cards => res.send(cards));
});

module.exports = router;