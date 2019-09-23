const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario.']
  },
  description: {
    type: String,
    unique: true,
    required: [true, 'La descripcion es necesaria.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  status: {
    type: Boolean,
    default: true,
  },
});

categoriaSchema.methods.toJSON = function () {

  let categoria = this;
  let categoriaObject = categoria.toObject();
  delete categoriaObject.status;

  return categoriaObject;
}
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' });

module.exports = mongoose.model('Categoria', categoriaSchema);

