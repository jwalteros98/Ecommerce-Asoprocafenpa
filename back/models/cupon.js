'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuponSchema = new Schema({
    codigo: {type: String, required: true},
    tipo: {type: String, required: true}, //porcentaje | precio fijo
    valor: {type: Number, required: true},
    limite: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('cupon', CuponSchema);