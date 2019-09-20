const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find(
    {//condiciones de busqueda
      estado: true
    },//datos a mostrar 
    'name email role',
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

      Usuario.count({
        //condiciones iguales a las de arriba
        estado: true
      }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          conteo,
        })
      })
    })

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
  let body = _.pick(req.body, ['name', 'email', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.delete('/usuarioLogico/:id', function (req, res) {
  let id = req.params.id;
  let body = { estado: false };

  Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        },
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.delete('/usuarioFisico/:id', function (req, res) {

  let id = req.params.id;
  console.log(id);
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'usuario no encontrado'
        },
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });
  });

});


module.exports = app;