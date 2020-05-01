const Sequelize = require('sequelize');
const sequelize = require('../app').sequelize;

const Model = Sequelize.Model;
class User extends Model { }
User.init({
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user'
});

module.exports = User;