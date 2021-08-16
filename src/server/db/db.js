const Sequelize = require('sequelize');
const DB_STRING = process.env.DATABASE_STRING || 'postgres://super-rogatory@localhost:5432/chatterly';
const db = new Sequelize(DB_STRING, {
	logging: false,
});

module.exports = db;
