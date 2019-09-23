const express = require('express');
const _ = require('underscore');

const app = express();
const Categoria = require('../models/categoria');
const {
  verificarToken,
  verificarRol,
} = require('../middlewares/auth');

app.get('/categoria', verificarToken, (req, res) => {

  Categoria.find({})
  .sort('name')
  .populate('user','name email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      })
    })

});


app.get('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id;

  // Categoria.findById(id, (err, categoria) => {
  Categoria.findOne({ _id: id }, (err, categoria) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria,
    })
  });
});

app.post('/categoria', [verificarToken, verificarRol], function (req, res) {

  let body = req.body;
  let categoria = new Categoria({
    name: body.name,
    description: body.description,
    status: body.status,
    user: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

app.put('/categoria/:id', verificarToken, function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let category = {
    name: body.name,
    description: body.description,
  };
  Categoria.findByIdAndUpdate(id, category, { new: true, runValidators: true, context: 'query' }, (err, categoria) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria,
    });
  });
});

app.delete('/categoriaLogico/:id', [verificarToken, verificarRol], function (req, res) {
  let id = req.params.id;
  let body = { status: false };

  Categoria.findByIdAndUpdate(id, body, { new: true, }, (err, categoria) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        },
      });
    }

    res.json({
      ok: true,
      categoria
    });
  });
});

app.delete('/categoriaFisico/:id', [verificarToken, verificarRol], function (req, res) {

  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoria) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'usuario no encontrado'
        },
      });
    }

    res.json({
      ok: true,
      categoria,
    });
  });
});


module.exports = app;