const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.testPG);

const models = {
  User: sequelize.import('./user')
};

// Object.keys(models).forEach(key => {
//   if ('associate' in models[key]) {
//     models[key].associatel(models);
//   }
// });

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;