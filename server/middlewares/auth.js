const jwt = require('jsonwebtoken');
const SEED = process.env.SEED;

// ================================
// VERIFICAR TOKEN
// ================================

let verificarToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
}


// ================================
// VERIFICAR TOKEN
// ================================

let verificarRol = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Usuario no es de tipo administrador',
      },
    });
  }
}


// ================================
// VERIFICAR TOKEN Para Imagenes
// ================================

let verificarTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
}


module.exports = {
  verificarToken,
  verificarTokenImg,
  verificarRol,
}