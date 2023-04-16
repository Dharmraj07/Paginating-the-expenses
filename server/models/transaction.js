const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users");


const Transaction = sequelize.define('transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('expense', 'income'),
        allowNull: false
    }
});

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User);

sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((error) => {
        console.error('Unable to synchronize the models:', error);
    });

module.exports = Transaction;
