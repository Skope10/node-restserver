const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  if (!req.files) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'Fallo alta de archivo'
        }
      })
  }

  let archivo = req.files.archivo;
  let nombreArchivo = archivo.name.split('.');
  let extension = nombreArchivo[nombreArchivo.length - 1];
  //Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'jpeg'];

  if (extensionesValidas.indexOf(extension) < 0) {
    if (err) {
      return res.status(400)
        .json({
          ok: false,
          err: {
            message: 'Extension no valida',
          },
        })
    }
  }
  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${archivo.name}`, (err) => {
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          err,
        })
    }
    res.json({
      ok: true,
      message: 'Imagen subida!',
    })
  });
});

module.exports = app;