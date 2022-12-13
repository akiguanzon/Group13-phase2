require('dotenv').config();

var User = require('../model/user');
var Post = require('../model/post');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function isValidUrl(data) {
    let url;
    try {
        url = new URL(data)
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:"
}

function comparePassword(plaintextPassword, hash) {
    bcrypt.compare(plaintextPassword, hash)
        .then(result => {
            console.log(`result is ${result}`);
            return result
        })
        .catch(err => {
            console.log(err)
        })
}



message = '';

const controlleruser = {
    //Go to login page
    login: async (req, res) => {
        if (!req.session.username) {
            res.render('users/login', { message });
        }
        else {
            res.redirect(`/user/${req.session.username}`)
        }
        message = '';
    },

    //Verify login and go to user page if successful
    checkLogin: async (req, res) => {
        message = '';
        var check;
        var data = req.query;
        var user = await User.findOne({ username: req.body.username })
            .then(async (check) => {
                var user = await User.findOne({ username: req.body.username });
                if (user.username === req.body.username) {

                    bcrypt.compare(req.body.password, user.password, async function (err, isMatch) {
                        if (!isMatch) {
                            message = 'Passwords do not match.';
                            res.redirect('/login');
                        }
                        else {
                            req.session.username = req.body.username;
                            var currentUser = await User.findOne({ 'username': req.session.username });
                            var posts = await Post.find({ 'username': req.session.username })
                            res.render('users/userPage', { currentUser, posts });
                        }
                    })
                }
            })
            .catch(() => {
                message = 'No user found.';
                console.log('No user found');
                res.redirect('/login');
            });
    },

    //Go to user page
    userPage: async (req, res) => {
        if (req.session.username) {
            var { username } = req.params;
            var currentUser = await User.findOne({ 'username': username });
            var posts = await Post.find({ 'username': username });
            if (currentUser) {
                res.render('users/userPage', { currentUser, posts });
            }
            else {
                data = {
                    username: 'Not found',
                    password: 'unknown',
                    profilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
                    gifUrl: 'https://media0.giphy.com/media/LbBSU26sSRAE8/giphy.gif',
                    backgroundUrl: 'https://media0.giphy.com/media/3ohhwBL1q1I66srvAA/giphy.gif',
                    bio: 'User not found.'
                }
                currentUser = new User(data);
                res.render('users/userPage', { currentUser, posts });
            }
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Go to register page
    signup: async (req, res) => {
        var usernames = await User.find();

        res.render('users/createUser', { usernames, message });
        message = '';
    },

    addUser: async (req, res) => {
        var users = await User.find()
            .then(async () => {
                var data = req.body;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(req.body.password, salt);
                var newUser = new User({
                    username: req.body.username,
                    password: hash,
                    profilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
                    gifUrl: 'https://media0.giphy.com/media/LbBSU26sSRAE8/giphy.gif',
                    backgroundUrl: 'https://media0.giphy.com/media/3ohhwBL1q1I66srvAA/giphy.gif',
                    bio: 'This is my bio.'
                });
                console.log('1 ' + hash);
                return newUser;
            })
            .then(async (newUser) => {
                var users = await User.find();
                var newUsername = newUser.username.toLowerCase()
                for (let user of users) {
                    var lowercaseUser = user.username.toLowerCase();
                    if (lowercaseUser === newUsername) {
                        return null;
                    }
                }
                return newUser;
            })
            .then(async (newUser) => {
                console.log(newUser);
                if (newUser) {
                    await newUser.save();
                    return newUser;
                }
                else {
                    return null;
                }
            })
            .then(async (newUser) => {
                if (newUser) {
                    res.redirect(`/user/${newUser.username}`);
                }
                else {
                    message = 'The username already exists.';
                    res.redirect('/signup');
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/signup');
            })
    },

    //Logout
    logout: async (req, res) => {
        if (process.env.STATUS === 'development') {
            req.session.destroy();
        }
        else {
            req.session = null
        }
        res.redirect('/login');
    },

    //Edit user
    editUser: async (req, res) => {
        if (req.session.username) {
            var { username } = req.params;
            message = '';
            var user = await User.findOne({ username });
            if (user.username === req.session.username) {
                res.render('users/editUser', { user, message });
            }
            else {
                res.redirect(`/user/${user.username}`);
            }
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Verify edit user
    verifyEditUser: async (req, res) => {
        if (req.session.username) {
            const { username } = req.params;
            var { bio, backgroundUrl, gifUrl, profilePicUrl } = req.body;

            if (!isValidUrl(backgroundUrl) || !isValidUrl(gifUrl) || !isValidUrl(profilePicUrl)) {
                message = 'Invalid URL.';
                res.redirect(`/user/${username}/edit`);
            }
            else {
                var user = await User.findOneAndUpdate({ username }, { bio, backgroundUrl, gifUrl, profilePicUrl })
                    .then(() => {
                        res.redirect(`/user/${username}`);
                    })
                    .catch(() => {
                        res.redirect('/');
                    })
            }
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Delete user
    deleteUser: async (req, res) => {
        if (req.session.username) {
            var { username } = req.params;
            var user = await User.findOne({ username });
            if (user.username === req.session.username) {
                req.session.destroy();
                var user = await User.findOneAndDelete({ username });
                res.redirect('/');
            }
            else {
                res.redirect(`/user/${username}`);
            }

        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    }
}

module.exports = controlleruser;