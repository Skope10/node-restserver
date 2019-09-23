

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

const GOOGLE_KEY = "AIzaSyAy_ngw6KH0BQG_Lr8YLeYd7H94d3fjbkg";

//para codificar el url del servidor remoto, se debe de hacer una variable de entorno 
// segun a donde se vaya a subir ( hay distintas maneras dependiendo del sitio ya sea heroku o DigitalOcean)
process.env.URLDB = urlDB;


// ======================================
// GOOGLE CLIENT ID
// ======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '774411371229-96kppvt4tb2jklnn63bartl2jtc3sflc.apps.googleusercontent.com';
