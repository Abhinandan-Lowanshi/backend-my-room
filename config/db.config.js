const env = require('dotenv')
env.config();

module.exports = {
    HOST: 'localhost',
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: "myRoom",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};