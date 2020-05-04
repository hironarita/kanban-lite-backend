const Sequelize = require('sequelize');
const sequelize = require('../app').sequelize;
const User = require('./user');

const Model = Sequelize.Model;
class Column extends Model { }
Column.init({
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    boardIndex: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    // foreign key
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }

}, {
    sequelize,
    modelName: 'column'
});

module.exports = Column;