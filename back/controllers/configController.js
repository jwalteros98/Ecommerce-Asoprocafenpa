var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req, res){
    if (req.user){
        if(req.user.role == 'admin'){

           let reg = await Config.findById({_id:"63264e8c1c84d6cb71107768"});
           res.status(200).send({data:reg});

        }else{
            res.status(500).send({ message: "No tienes autorización", data: undefined });
        }
    }else{
        res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
}

const actualiza_config_admin = async function(req, res){
    if (req.user){
        if(req.user.role == 'admin'){

            let data = req.body;

            if(req.files){

                /*console.log("si hay una image");*/

                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name = name[2];

                let reg = await Config.findByIdAndUpdate({_id:"63264e8c1c84d6cb71107768"},{
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo,
                });

                fs.stat('./uploads/configuraciones/' + reg.logo, function(err) {
                    if (!err){
                        fs.unlink('./uploads/configuraciones/' + reg.logo, (err) => {
                            if (err) throw err;
                        }
                        )
                    }
                })
                res.status(200).send({data: reg});

            }else{
                /*console.log("No hay una image");*/

                let reg = await Config.findByIdAndUpdate({_id:"63264e8c1c84d6cb71107768"},{
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo,
                });
                res.status(200).send({data: reg});
            }
            

        }else{
            res.status(500).send({ message: "No tienes autorización", data: undefined });
        }
    }else{
        res.status(500).send({ message: "No tienes autorización", data: undefined });
    }
}

const obtener_logo = async function(req, res) {
    var img = req.params['img'];

    //console.log(img); //mostrar el nombre de la imagen en el servidor (consola)
    fs.stat('./uploads/configuraciones/' + img, function(err) {
        if (!err){
            let path_img = './uploads/configuraciones/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_config_publico = async function(req, res){
    let reg = await Config.findById({_id:"63264e8c1c84d6cb71107768"});
    res.status(200).send({data:reg});
}

module.exports = {
    actualiza_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
}