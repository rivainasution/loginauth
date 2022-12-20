const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('report', 'root', '',{
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    options: {
      useUTC: false,
      dateFirst: 1,
    },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//tabel
db.users = require('./user')(sequelize, Sequelize);

module.exports = db;