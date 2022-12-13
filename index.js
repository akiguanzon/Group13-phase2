require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const routes = require('./routes/route.js')

if (process.env.STATUS === 'development') {
    var session = require('express-session');

}
else {
    var session = require('cookie-session');
}


const methodOverride = require('method-override');
const path = require('path');

process.env.STATUS === 'development'
    ? (db_port = process.env.dev_DB)
    : (db_port = process.env.prod_DB)

mongoose.connect(db_port, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!')
        console.log(err)
    })

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(function (req, res, next) {
    res.locals.loggedin = req.session.username;
    next();
});

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
