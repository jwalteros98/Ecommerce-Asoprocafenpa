'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactoSchema = new Schema({
    cliente: {type: String, required: true},
    mensaje: {type: String, required: true},
    asunto: {type: String, required: true},
    estado: {type: String, required: true},
    telefono: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('contacto', ContactoSchema);