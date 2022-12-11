const express = require('express');
const mongoose = require('mongoose');
const app = express();

const routes = require('./routes/route.js')
const session = require('express-session');

const methodOverride = require('method-override');
const path = require('path');

mongoose.connect('mongodb://0.0.0.0:27017/group13DB', { useNewUrlParser: true, useUnifiedTopology: true })
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