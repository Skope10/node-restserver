const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./cliente'));
app.use(require('./login'));

module.exports = app;
