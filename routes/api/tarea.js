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