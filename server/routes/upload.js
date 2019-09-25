const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'Fallo alta de archivo'
        }
      })
  }

  //Valida Tipo
  let tiposValidos = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'Tipo no valido',
        },
      })
  }

  let archivo = req.files.archivo;
  let nombreArchivo = archivo.name.split('.');
  let extension = nombreArchivo[nombreArchivo.length - 1];
  //Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'jpeg'];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'Extension no valida',
        },
      })
  }
  const date = new Date();
  const PicDate = `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getTime()}`;
  // Cambiar nombre al archivo
  nombreArchivo = `${id}-${PicDate}.${extension}`;
  //nombreArchivo = `${id}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          err,
        })
    };

    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});


function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      borraArchivo({ tipo: 'usuarios', imagen: nombreArchivo });

      return res.status(500).json({
        ok: false,
        err,
      });
    };

    if (!usuario) {
      borraArchivo({ tipo: 'usuarios', imagen: nombreArchivo });

      return res.status(400).json({
        ok: false,
        err,
      });
    };

    borraArchivo({ tipo: 'usuarios', imagen: usuario.img });

    usuario.img = nombreArchivo;
    usuario.save((er, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
      })
    });
  });
};

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, producto) => {
    if (err) {
      borraArchivo({ tipo: 'productos', imagen: nombreArchivo });

      return res.status(500).json({
        ok: false,
        err,
      });
    };

    if (!producto) {
      borraArchivo({ tipo: 'productos', imagen: nombreArchivo });

      return res.status(400).json({
        ok: false,
        err,
      });
    };

    borraArchivo({ tipo: 'productos', imagen: producto.img });

    producto.img = nombreArchivo;
    producto.save((er, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
      })
    });
  });
};

function borraArchivo({ tipo, imagen }) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;