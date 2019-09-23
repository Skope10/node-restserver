const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto');
const { verificarToken } = require('../middlewares/auth');
const app = express();


// Obtener todos los productos
// Trae todos los productos con categoria y usuario
// y paginado
app.get('/producto', [verificarToken], (req, res) => {
  let { skip, limit } = req.body;
  skip = Number(skip);
  limit = Number(limit);

  Producto.find({ 'available': true })
    .skip(skip || 0)
    .limit(limit || 3)
    .populate('category','name')
    .populate('user', 'name email')
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      res.json({
        ok: true,
        productos,
      });
    });
});

//Obtener producto por Id
app.get('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id;

  Producto.findOne({ _id: id })
    .populate('category','name')
    .populate('user', 'name email')
    .exec((err, producto) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      if (!producto) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      res.json({
        ok: true,
        producto,
      });
    });
});

// Crear nuevo producto
app.post('/producto', [verificarToken], (req, res) => {
  let body = req.body;
  let producto = new Producto({
    name: body.name,
    priceUni: body.priceUni,
    description: body.description,
    category: body.category,
    user: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    };

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// Actualizar producto
app.put('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let producto = {
    name: body.name,
    priceUni: body.priceUni,
    description: body.description,
    category: body.category,
    user: req.usuario._id,
    available: body.available,
  };

  Producto.findByIdAndUpdate(
    id,
    producto,
    { new: true, runValidators: true, context: 'query' },
    (err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      };

      if (!producto) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      res.json({
        ok: true,
        producto,
      });
    });
});

// Eliminar producto Logico
app.delete('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id;
  let body = { available: false };

  Producto.findByIdAndUpdate(id, body, { new: true, }, (err, producto) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no encontrado',
        },
      });
    };

    res.json({
      ok: true,
      producto
    });
  });
});

// Buscar productos
app.get('/producto/buscar/:termino', [verificarToken], (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');

  Producto.find({ name: regex })
    .populate('category','name')
    .exec((err, producto) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      if (!producto) {
        return res.status(400).json({
          ok: false,
          err,
        });
      };

      res.json({
        ok: true,
        producto,
      });
    });
});

module.exports = app;