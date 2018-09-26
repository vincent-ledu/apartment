const fs = require('fs');
const express = require('express')
const app = express()
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const morgan = require('morgan'); // Charge le middleware de logging
const favicon = require('serve-favicon'); // Charge le middleware de favicon
//const multer  = require('multer')
//const JsonDB = require('node-json-db');
//const Jimp = require("jimp");


app.use(session({ secret: 'calendarsessionsecret' }))
.use(morgan('combined'))
.use(express.static(__dirname + '/public'))
.use(favicon(__dirname + '/public/favicon.png'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/apartments/', function (req, res) {
  res.render('appartments.ejs')
})

app.post('/apartments/', function(req, res, next) {
  if (req.body.title != 'undefined' && req.body.title != '') {
    var title = req.body.title
  }
  else {
    console.log("title is not defined")
  }
  var description = req .body.description
  console.log()
  res.redirect('/apartments')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})