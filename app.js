const express = require('express');
const app = express();
const session = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Charge le middleware de logging
const favicon = require('serve-favicon'); // Charge le middleware de favicon
const mongoose = require('mongoose');
const config = require('./config');
const multer = require('multer');

const URL_MONGO = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/apartments';

mongoose.connect(URL_MONGO, config.DB_OPTIONS);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error'));
db.once('open', function() {
  console.log('DB connection OK');
});

const apartmentSchema = mongoose.Schema({
  title: String,
  description: String,
  adresse: String,
  price: String,
  contact: String,
  photo: Buffer,
});
const Apartment = mongoose.model('Apartment', apartmentSchema);


app.use(session({ secret: 'calendarsessionsecret' }))
    .use(morgan('combined'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(__dirname + '/public'))
    .use(favicon(__dirname + '/public/favicon.png'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/apartments/', function(req, res) {
  console.log('entering get /apartments');
  Apartment.find(function(err, apartments) {
    console.log('in find apartments');
    if (err) {
      res.send(err);
    }
    console.log('found ' + apartments.length + ' apartment(s).');
    console.log('launch render apartments');

    res.render('apartments.ejs', { apartments: apartments });
  });
});

app.post('/apartments/', function(req, res, next) {
  if (req.body.title != 'undefined' && req.body.title != '') {
    const apartment = new Apartment();
    apartment.title = req.body.title;
    apartment.description = req.body.description;
    apartment.price = req.body.price;
    apartment.address = req.body.address;
    apartment.contact = req.body.contact;
    console.log('title: ' + apartment.title +
    ' - description: ' + apartment.description + ' - price: ' + apartment.price
    + ' - address: ' + apartment.price);
    apartment.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
  } else {
    console.log('title is not defined');
  }
  res.redirect('/apartments');
});
app.route('/apartments/:id')
    .get(function(req, res, next) {
      console.log('param: ' + req.params.id);
      Apartment.findById(req.params.id, function(err, apart) {
        if (err) {
          res.send(err);
        }
        res.render('apartment.ejs', {apartment: apart});
      });
    })
    .put(function(req, res, next) {
      console.log('not yet implemented');
      res.render('apartment.ejs', {apartment: apart});
    })
    .post(function(req, res, next) {
      console.log('not yet implemented');
      res.render('apartment.ejs', {apartment: apart});
    });

var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).array("imgUploader", 3);


app.post('/apartments/:id/photos', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end('Something went wrong!');
    }
    res.redirect('/apartments/'+req.params.id);
  });
});

app.on('close', function() {
  mongoose.connection.close();
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
