var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var con = mysql.createPool({
    host:"localhost",
    user: "root",
    password:"qwerty123",
    database:"elecciones",
    insecureAuth:true,
    multipleStatements:true
});

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

module.exports = router;