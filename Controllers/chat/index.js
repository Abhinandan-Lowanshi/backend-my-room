const req = require('express/lib/request');
const chatController = require('./chat');
const ctUserConrtoller = require('./chatUser')

module.exports = { chatController, ctUserConrtoller };
