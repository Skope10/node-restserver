const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const Cliente = require('../models/cliente');

app.get('/cliente', function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Cliente.find(
    {//condiciones de busqueda
    },//datos a mostrar 
    'name',
  )
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Cliente.count({
        //condiciones iguales a las de arriba
      }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          conteo,
        })
      })
    })

});

app.post('/cliente', function (req, res) {

  let body = req.body;
  let cliente = new Cliente({
    name: body.name,
  });

  cliente.save((err, clienteDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: clienteDB,
    });
  });
});

module.exports = app;