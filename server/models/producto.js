var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario']
  },

  priceUni: {
    type: Number,
    required: [true, 'El precio únitario es necesario']
  },

  description: {
    type: String,
    required: false
  },

  img: {
    type: String,
    required: false,
  },

  available: {
    type: Boolean,
    required: true,
    default: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});


module.exports = mongoose.model('Producto', productoSchema);