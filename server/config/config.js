

// ======================================
// Puerto
// ======================================
process.env.PORT = process.env.PORT || 3000;

// ======================================
// Entorno
// ======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================================
// Vencimiento Token
// ======================================
process.env.CADUCIDAD_TOKEN = '30d';

// ======================================
// SEED / semilla de autenticacion
// ======================================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo';
// Variable de entorno

// ======================================
// DB
// ======================================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}

//para codificar el url del servidor remoto, se debe de hacer una variable de entorno 
// segun a donde se vaya a subir ( hay distintas maneras dependiendo del sitio ya sea heroku o DigitalOcean)
process.env.URLDB = urlDB;