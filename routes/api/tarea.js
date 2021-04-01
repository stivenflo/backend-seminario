//==================LIBRERIAS=====================
var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const secret_key = process.env.SECRET_KEY || "prew";
//================================================

//===========CONEXION A BASE DE DATOS=============
var con = mysql.createPool({
    host:"localhost",
    user: "root",
    password:"qwerty123",
    database:"tareas",
    insecureAuth:true,
    multipleStatements:true
});
//================================================

//========API PARA MOSTRAR DATOS DE TAREAS========
router.get('/get_tarea', (req, res, next) => {
    var query = 'select * from tarea';
    con.query(query, (err, result, field) => {
       if(err){
           next(err);
       } else {
           res.status(200).json(result)
       }
      });
});
//================================================

//========API PARA INSERTAR DATOS DE TAREAS=======
router.post('/insert_tarea', (req, res, next) => {
    var query = 'INSERT INTO tarea (titulo, tarea) values (?, ?)';
    var values = [req.body.titulo,
                  req.body.tarea];

    con.query(query, values, (err, result, field) => {
       if(err){
           next(err);
       } else {
           res.status(200).json(result)
       }
      });
});
//================================================

//========API PARA MODIFICAR DATOS DE TAREAS======
router.put('/update_tarea', (req, res, next) => {
    var query = 'Update tarea set tarea=? WHERE titulo = ?';
    
    var values = [req.body.tarea,
                  req.body.titulo];

    con.query(query, values, (err, result, field) => {
       if(err){
           next(err);
       } else {
           res.status(200).json(result)
       }
      });
});
//================================================

//========API PARA BORRAR DATOS DE TAREAS=========
router.delete('/delete_tarea', (req, res, next) => {
    var query = 'delete from tareas.tarea where titulo = ?';
    
    var values = [req.query.titulo];

    con.query(query, values, (err, result, field) => {
       if(err){
           next(err);
       } else {
           res.status(200).json(result)
       }
      });
});
//================================================

//========API PARA MOSTRAR DATOS DE USUARIO=======
router.get('/get_usuario', (req, res, next) => {
    var query = 'select * from usuarios';
    con.query(query, (err, result, fields) => {
        if(err) {
            next(err);
        } else {
            res.status(200).json(result);
        }
    });
});
//================================================

//========API PARA INSERTAR DATOS DE USUARIO======
router.post('/insert_usuario', (req, res, next) => {
    var user = {
        usuario: req.body.usuario,
        clave: req.body.clave
    };
    const create_user = (user) => {
        var query = "INSERT INTO usuarios (usuario, clave) VALUES (?) ";
        con.query(query, [Object.values(user)], (err, result, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    };
    bcrypt.hash(user.clave, 10).then((hashedClave) => {
        user.clave = hashedClave;
        create_user(user);
    });
});
//================================================

//=========API PARA LOGEO A LA APLICACION=========
router.post('/login', (req,res,next) =>{
    var user = {
        usuario: req.body.usuario,
        clave: req.body.clave
    };
    const get_token = (user) => {
        var query = "SELECT USUARIO, CLAVE  FROM usuarios WHERE usuario = ?"
        con.query(query, [user.usuario], (err, result, fields) => {
            if (err || result.length == 0) {
                console.log(err);
                res.status(400).json({message:"Usuario o Contraseña Incorrectos"});
            } else {
                bcrypt.compare(user.clave,result[0].CLAVE, (error, isMatch)=> {
                    if (isMatch){
                        var token = jwt.sign({userId: result[0].id}, secret_key);
                        res.status(200).json({token});
                    }else if (error){
                        res.status(400).json(error);
                    }else {
                        res.status(400).json({message: "Usuario o Contraseña Incorrectos"});
                    }
                });
            }
        });
    }
    get_token(user);

});
//================================================
module.exports = router;