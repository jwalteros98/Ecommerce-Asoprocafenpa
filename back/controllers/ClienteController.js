"use strict";

var Cliente = require("../models/cliente"); // Importando
var Venta = require("../models/venta"); // Importando
var Dventa = require("../models/dventa"); // Importando
var Contacto = require("../models/contacto"); // Importando
var bcrypt = require("bcrypt-nodejs"); // Importando bcryptjs para encriptar la contraseña
var jwt = require("../helpers/jwt"); // Importando el helper jwt para generar el token
var Direccion = require("../models/direccion");

const registro_cliente = async function (req, res) {
  //
  var data = req.body;
  var cliente_arr = [];

  cliente_arr = await Cliente.find({ email: data.email });

  if (cliente_arr.length == 0) {

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
            if(hash){
                data.password = hash;
                var reg = await Cliente.create(data);
                res.status(200).send({ data:reg}); 
            }else{
                res.status(200).send({ message: "ErrorServer", data:undefined });
            }
        })
    } else {
        res.status(200).send({ message: 'No hay una contraseña', data:undefined });
    }  
  } else {
    res.status(200).send({ message: "El usuario ya existe", data: undefined });
  }
}

const login_cliente = async function (req, res) {
  var data = req.body;
  var cliente_arr = [];

  cliente_arr = await Cliente.find({ email: data.email });
  
  if (cliente_arr.length == 0) {
    res.status(200).send({ message: "El usuario no existe", data: undefined });
  } else {
      //Login
      let user = cliente_arr[0];

      bcrypt.compare(data.password, user.password, async function (error, check){
        if (check){
              res.status(200).send({ 
                data: user,
                token: jwt.createToken(user) 
              });
            }else{
              res.status(200).send({ message: "Contraseña no coinciden", data: undefined });
            }
      }); 
  }  
}

const listar_clientes_filtro_admin = async function (req, res) {
  if(req.user){
    if(req.user.role == 'admin'){
      let tipo = req.params['tipo'];
      let filtro = req.params['filtro'];

      /*console.log(tipo);*/

      if(tipo == null || tipo == 'null'){
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      }else{
        if(tipo == 'apellidos'){
          let reg = await Cliente.find({ apellidos: new RegExp(filtro,'i') });
          res.status(200).send({ data: reg });

        }else if(tipo == 'correo'){
          let reg = await Cliente.find({ email: new RegExp(filtro,'i') });
          res.status(200).send({ data: reg });
        }
      }
    }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }

  
}

const registro_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin'){
      var data = req.body;

      bcrypt.hash('123456789', null,null, async function(err, hash){
        if (hash){
          data.password = hash;
          let reg = await Cliente.create(data);
          res.status(200).send({ data: reg });
        }else{
          res.status(200).send({ message: 'Hubo un error en el servidor', data:undefined });
        }
      })
   
    }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
  
}

const obtener_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin'){
        
      var id = req.params['id'];

      try {
        var reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }

    }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const actualizar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin'){
        
      var id = req.params['id'];
      var data = req.body;

      var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
        nombres : data.nombres,
        apellidos : data.apellidos,
        email : data.email,
        telefono : data.telefono,
        f_nacimiento : data.f_nacimiento,
        dni : data.dni,
        genero : data.genero
      });

      res.status(200).send({ data: reg });

    }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const eliminar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'admin'){
        
      var id = req.params['id'];

      let reg = await Cliente.findByIdAndRemove({ _id: id });
      res.status(200).send({ data: reg });

    }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}


//---- controlador clientes -------//
const obtener_cliente_guest = async function (req, res) {
  if (req.user) {

    var id = req.params['id'];

      try {
        var reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }

  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const actualizar_perfil_cliente_guest = async function (req, res) {
  if (req.user) {

    var id = req.params['id'];
    var data = req.body;

    /*console.log(data.password);*/

    if(data.password){
      /*console.log('con contraseña');*/
      bcrypt.hash(data.password, null, null, async function(error, hash){
        var reg = await Cliente.findByIdAndUpdate({_id:id},{
          nombres: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono,
          dni: data.dni,
          f_nacimiento: data.f_nacimiento,
          genero: data.genero,
          pais: data.pais,
          password: hash,
        });
        res.status(200).send({ data: reg });
      });

    }else{
      /*console.log('sin contraseña');*/
      var reg = await Cliente.findByIdAndUpdate({_id:id},{
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        dni: data.dni,
        f_nacimiento: data.f_nacimiento,
        genero: data.genero,
        pais: data.pais,
      });
      res.status(200).send({ data: reg });
    }

  }else{
    res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

//---- Direcciones clientes -------//
const registro_direccion_cliente = async function(req, res){
  if (req.user){
    var data = req.body;
    if(data.principal){
      let direcciones = await Direccion.find({cliente:data.cliente});

      direcciones.forEach(async element => {
        await Direccion.findByIdAndUpdate({_id: element._id},{principal:false});
      });
    }
    

    let reg = await Direccion.create(data);
    res.status(200).send({data:reg});    
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const obtener_direccion_todos_cliente = async function(req, res){
  if (req.user){
    var id = req.params['id'];

    let direcciones = await Direccion.find({cliente:id}).sort({createdAt: -1});

    res.status(200).send({data:direcciones});    
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const cambiar_direccion_principal_cliente = async function(req, res){
  if (req.user){
    var id = req.params['id']; 
    var cliente = req.params['cliente'];  
    
    let direcciones = await Direccion.find({cliente:cliente});

    direcciones.forEach(async element => {
      await Direccion.findByIdAndUpdate({_id: element._id},{principal:false});
    });

    await Direccion.findByIdAndUpdate({_id:id},{principal:true});
    
    res.status(200).send({data:true});    
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const obtener_direccion_principal_cliente = async function(req, res){
  if (req.user){
    var id = req.params['id'];
    var direccion = undefined;
    
    direccion = await Direccion.findOne({cliente:id, principal:true});
    if(direccion == undefined){
      res.status(200).send({data:undefined});
    }else{
      res.status(200).send({data:direccion});
    }
     
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

//---- Contacto -------//

const enviar_mensaje_contacto = async function(req, res){
  let data = req.body;
  data.estado = 'Mensaje nuevo';
  let reg = await Contacto.create(data);
  res.status(200).send({ data: reg });

}

//---- Pedidos -------//
const obtener_ordenes_cliente = async function(req, res){
  if (req.user){
    var id = req.params['id'];

    let reg = await Venta.find({cliente: id}).sort({createdAt: -1});

    if(reg.length >= 1){
      res.status(200).send({data:reg});
    }else if (reg.length == 0){
      res.status(200).send({ data: undefined });
    }
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const obtener_detalle_ordenes_cliente = async function(req, res){
  if (req.user){
    var id = req.params['id'];

    try {
      let venta = await Venta.findById({_id: id}).populate('direccion').populate('cliente');
      let detalles = await Dventa.find({venta: id}).populate('producto');

      res.status(200).send({ data: venta, detalles: detalles });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }
    
  }else{
      res.status(500).send({ message: "No tienes autorización", data: undefined });
  }
}

const registro_cliente_tienda = async function(req,res){
  //
  var data = req.body;
  var clientes_arr = [];

  clientes_arr = await Cliente.find({email:data.email});
  console.log(data);
  if(clientes_arr.length == 0){
      if(data.password){
          bcrypt.hash(data.password,null,null, async function(err,hash){
              if(hash){
                  data.dni = '';
                  data.password = hash;
                  var reg = await Cliente.create(data);
                  res.status(200).send({data:reg});
              }else{
                  res.status(200).send({message:'ErrorServer',data:undefined});
              }
          })
      }else{
          res.status(200).send({message:'No hay una contraseña',data:undefined});
      }

      
  }else{
      res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
  }
}

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,

  obtener_cliente_guest,
  actualizar_perfil_cliente_guest,

  registro_direccion_cliente,
  obtener_direccion_todos_cliente,
  cambiar_direccion_principal_cliente,
  obtener_direccion_principal_cliente,

  enviar_mensaje_contacto,

  obtener_ordenes_cliente,
  obtener_detalle_ordenes_cliente,

  registro_cliente_tienda,

};
