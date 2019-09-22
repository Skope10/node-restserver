require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// Using Node.js `require()`
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require('./routes'));

app.get('/', function (req, res) {
  res.send('Hello World');
});

mongoose.connect(process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err;
    console.log('BD ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log('ESCUCHANDO PUERTO ', process.env.PORT)
});