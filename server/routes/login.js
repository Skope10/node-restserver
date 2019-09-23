const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos',
        }
      });
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos',
        }
      });
    }

    let token = jwt.sign({
      usuario: user,
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    res.json({
      ok: true,
      usuario: user,
      token,
    });
  });
});

// Configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}


app.post('/google', async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token)
    .catch(e => {
      return res.status(403).json({
        ok: false,
        err: e
      });
    });

  Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    };

    if (userDB) {
      if (!userDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe usar su auth normal.',
          },
        });
      } else {

        let token = jwt.sign({
          usuario: userDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
          ok: true,
          usuario: userDB,
          token,
        })
      }
    } else {

      //si no existe, es un nuevo usuario
      let usuario = new Usuario();
      usuario.name = googleUser.name;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        };

        let token = jwt.sign({
          usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        })

      })
    }
  })

});

module.exports = app;
