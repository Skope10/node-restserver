const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario.']
  },
});

clienteSchema.methods.toJSON = function() {
  
  let user = this;
  let userObject = user.toObject();
  
  return userObject;
}
clienteSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico.'});

module.exports = mongoose.model('Cliente', clienteSchema);

