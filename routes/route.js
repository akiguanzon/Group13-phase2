const express = require('express');
const mongoose = require('mongoose');
const app = express();

const controllerhome = require('../controller/controllerhome.js');
const controllerpost = require('../controller/controllerpost.js');
const controlleruser = require('../controller/controlleruser.js');

//Home page section
app.get('/', controllerhome.goHome);
app.get('/about', controllerhome.goAbout)

//Login and signup section
app.get('/login', controlleruser.login);
app.post('/user', controlleruser.checkLogin);
app.get('/user/:username', controlleruser.userPage);
app.get('/signup', controlleruser.signup);
app.post('/signup', controlleruser.addUser);
app.get('/logout', controlleruser.logout);
app.get('/user/:username/edit', controlleruser.editUser);
app.patch('/user/:username', controlleruser.verifyEditUser);
app.delete('/user/:username', controlleruser.deleteUser);

//Post pages
app.get('/posts/featured', controllerpost.featuredPosts);
app.get('/posts/latest', controllerpost.latestPosts);
app.get('/post/:id', controllerpost.postsPage);
app.get('/posts/search', controllerpost.searchPosts);
app.get('/posts/:category', controllerpost.categoryPosts);
app.get('/newpost', controllerpost.newPosts);
app.post('/posts', controllerpost.verifyNewPost);
app.get('/post/:id/edit', controllerpost.editPost);
app.patch('/post/:id', controllerpost.verifyEditPost);
app.delete('/post/:id', controllerpost.deletePost);
app.post('/post/:id/comments', controllerpost.comments);
app.get('/post/:id/comment/:index', controllerpost.updateComment);
app.patch('/post/:id/comment/:index', controllerpost.comment);
app.delete('/post/:id/comment/:index', controllerpost.deleteComment);

module.exports = app;