const express = require('express');
const mongoose = require('mongoose');
const app = express();

const routes = require('./routes/route.js')
var session = require('cookie-session');

const methodOverride = require('method-override');
const path = require('path');

mongoose.connect('mongodb+srv://group13DB:group13DB@group13db.canhgfz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!')
        console.log(err)
    })

app.use(session({
  secret: 'socialNetCCAPDEVMCO',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

app.listen(3000, () => {
    console.log('I AM ON PORT 3000');
})

app.use('/', routes);
