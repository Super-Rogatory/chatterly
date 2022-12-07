const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env')});
const Sequelize = require('sequelize');
const DB_STRING = process.env.DATABASE_URL;
const config = {
	logging: false,
};

if (DB_STRING) {
	config.dialectOptions = {
		ssl: {
			rejectUnauthorized: false,
		},
	};
}

const db = new Sequelize(DB_STRING, config);

module.exports = db;
