'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'wltrx';

exports.auth = function(req, res, next) {
    
    if(!req.headers.authorization) {
        return res.status(403).send({message: 'No tienes autorización'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    var segments = token.split('.');

    if (segments.length != 3) {
        return res.status(403).send({message: 'Token no valido'});
    }else{
        try {
            var payload = jwt.decode(token, secret);
            
            if (payload.exp <= moment().unix()) {
                return res.status(403).send({message: 'El token ha expirado'});
            }


        } catch (error){
            return res.status(403).send({message: 'Token no valido'});
        }
    }

    req.user = payload;

    next();
}