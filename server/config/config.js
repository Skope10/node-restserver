

// ======================================
// Puerto
// ======================================
process.env.PORT = process.env.PORT || 3000;

// ======================================
// Entorno
// ======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================================
// DB
// ======================================
let urlDB;

// if(process.env.NODE_ENV === 'dev'){
//    urlDB = 'mongodb://localhost:27017/cafe';
//}else{
    urlDB = 'mongodb+srv://ferfenix:piCcA5tpmWilK4fu@coffee-cluster-dzd50.mongodb.net/cafe';
//}

//para codificar el url del servidor remoto, se debe de hacer una variable de entorno 
// segun a donde se vaya a subir ( hay distintas maneras dependiendo del sitio ya sea heroku o DigitalOcean)
process.env.URLDB = urlDB;