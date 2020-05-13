const Sequelize = require('sequelize');
const sequelize = require('../app').sequelize;
const Column = require('./column');

const Model = Sequelize.Model;
class Card extends Model { }
Card.init({
    title: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    columnIndex: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    // foreign key
    column_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Column,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }

}, {
    sequelize,
    modelName: 'card'
});

module.exports = Card;