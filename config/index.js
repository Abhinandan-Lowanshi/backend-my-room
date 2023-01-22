const env = require('dotenv');
env.config();

config = {
    SECRET_KEY: process.env.TOKEN_SECRET,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    HOST_NAME: process.env.HOST_NAME,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DOMAIN_NAME: process.env.DOMAIN_NAME
}

module.exports = config;