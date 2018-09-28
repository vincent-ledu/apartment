const fs = require('fs');
const express = require('express')
const app = express()
const session = require('cookie-session'); // Charge le middleware de sessions
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const morgan = require('morgan'); // Charge le middleware de logging
const favicon = require('serve-favicon'); // Charge le middleware de favicon
const mongoose = require('mongoose')


const db_host = 'localhost'
const db_port = 27017
const db_options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

const MongoClient = require('mongodb').MongoClient;
const urlmongo = "mongodb://"+db_host+":"+db_port+"/apartments";
mongoose.connect(urlmongo, db_options);

const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
  console.log("Connexion à la base OK"); 
}); 

const apartmentSchema = mongoose.Schema({
  title: String,
  description: String,
  adresse: String,
  price: String,
  tel: String
});
const Apartment = mongoose.model('Apartment', apartmentSchema);


app.use(session({ secret: 'calendarsessionsecret' }))
.use(morgan('combined'))
.use(bodyParser.urlencoded({extended: false}))
.use(express.static(__dirname + '/public'))
.use(favicon(__dirname + '/public/favicon.png'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/apartments/', function (req, res) {
  console.log("entering get /apartments");
  Apartment.find(function(err, apartments){
    console.log("in find apartments");
    if (err){
        res.send(err); 
    }
    console.log("found " + apartments.length + " apartment(s).")
    console.log('launch render apartments');

    res.render('appartments.ejs', {apartments: apartments});
  }); 
  
})

app.post('/apartments/', function(req, res, next) {
  if (req.body.title != 'undefined' && req.body.title != '') {
    var apartment = new Apartment();
    apartment.title =  req.body.title;
    apartment.description = req.body.description;
    console.log("title: "+apartment.title+" - description: " + apartment.description);
    apartment.save(function(err) {
      if (err) {
        res.send(err);
      }
    });

  }
  else {
    console.log("title is not defined");
  }
  res.redirect('/apartments');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})