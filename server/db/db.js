const Sequelize = require('sequelize');
const DB_STRING = process.env.DATABASE_URL || 'postgres://super-rogatory@localhost:5432/chatterly';

const config = {
	logging: false,
};

if (process.env.DATABASE_URL) {
	config.dialectOptions = {
		ssl: {
			rejectUnauthorized: false,
		},
	};
}

const db = new Sequelize(DB_STRING, config);

module.exports = db;
