const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const { verificarTokenImg } = require('../middlewares/auth');


app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  console.log(img, tipo);
  let pathImg = `./uploads/${tipo}/${img}`;

  let imagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(noImagePath);
  }

});

module.exports = app;
