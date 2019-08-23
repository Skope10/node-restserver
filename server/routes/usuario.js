const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
  res.send('GET Users');
});

app.post('/usuario', function (req, res) {

  let body = req.body;
  let usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  let body = req.body;

  Usuario.findByIdAndUpdate( id, body, {new :true, runValidators: true}, (err, usuarioDB) => {
    
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.delete('/usuario', function (req, res) {
  res.send('DELETE User');
});


module.exports = app;