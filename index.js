const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

var Post = require('./model/post');
var User = require('./model/user');
const { findOne } = require('./model/post');

var categories = ['School', 'Music', 'Travel', 'Gaming', 'Art'];

mongoose.connect('mongodb://localhost:27017/group13DB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!')
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

var message = '';

app.get('/', async (req, res) => {
    let posts = await Post.find({}).sort({ 'views': -1 });
    let latestPosts = await Post.find({}).sort({ 'date': -1 });
    posts = posts.slice(0, 5);
    latestPosts = latestPosts.slice(0, 5);
    res.render('home', { posts, latestPosts });
})


app.get('/posts/featured', async (req, res) => {
    var q = "Featured"
    var searchPosts = await Post.find({}).sort({ 'views': -1 });
    res.render('posts/search', { q, searchPosts });
})

app.get('/posts/latest', async (req, res) => {
    var q = "Latest";
    var searchPosts = await Post.find({}).sort({ 'date': -1 });
    res.render('posts/search', { q, searchPosts });
})

app.get('/posts/search', async (req, res) => {
    var { q } = req.query;
    var searchPosts = await Post.find({ $text: { $search: q } });
    res.render('posts/search', { q, searchPosts });
})

app.get('/posts/:category', async (req, res) => {
    var { category: q } = req.params;
    var searchPosts = await Post.find({ "category": q });
    res.render('posts/search', { q, searchPosts });
})

app.get('/post/new', (req, res) => {
    res.render('posts/newPage', { categories });
})

app.post('/posts', async (req, res) => {
    var data = req.body
    var newData = new Post(data)
    await newData.save();
    res.redirect('/');
})

app.post('/post/:id/comments', async (req, res) => {
    const data = req.body;
    var { id } = req.params;
    var currentPost = await Post.findById(id);
    currentPost.comments.push(data);
    await currentPost.save();
    res.redirect(`/post/${id}`);
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    res.render('posts/postPage', { post });
})

app.get('/post/:id/edit', async (req, res) => {
    const { id } = req.params;
    var post = await Post.findById(id);
    res.render('posts/updatePost', { post, categories });
})

app.patch('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, imgSrc, content, category } = req.body;
    const post = await Post.findByIdAndUpdate(id, { title, url, imgSrc, content, category }, { runValidators: true });
    res.redirect(`/post/${id}`);
})

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/');
})

app.get('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    var post = await Post.findById(id);
    console.log(index);
    res.render('comments/updateComment', { post, index });
})

app.patch('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    const { body } = req.body;
    var currentPost = await Post.findById(id);
    currentPost.comments[index].body = body;
    await currentPost.save();

    res.redirect(`/post/${id}`);
})

app.delete('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    var currentPost = await Post.findById(id);
    await currentPost.comments.pull(index);
    await currentPost.save();
    res.redirect(`/post/${id}`);
})


//USERNAMES CONTROLLER

app.get('/signup', async (req, res) => {
    var usernames = await User.find();

    res.render('users/createUser', { usernames, message });
})

app.get('/user', async (req, res) => {
    message = '';
    var data = req.query;
    var user = await User.findOne({ 'username': data.username })
        .then(async () => {
            var data = req.query;
            var user = await User.findOne({ 'username': data.username });
            if (user.password === data.password) {
                res.redirect(`/user/${data.username}`);
            }
            else if (user.password !== data.password) {
                message = 'Wrong password!';
                res.redirect('/login');
            }

        })
        .catch(() => {
            message = 'No user found.';
            res.redirect('/login');
        });
})



app.get('/user/:username', async (req, res) => {
    var { username } = req.params;
    var currentUser = await User.findOne({ "username": username });
    var posts = await Post.find({ 'username': username })

    res.render('users/userPage', { currentUser, posts });
})

app.post('/user', async (req, res) => {
    message = '';
    var users = await User.find()
        .then(async () => {
            var data = req.body;
            var newUser = await new User(data);
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

})

app.get('/user/:username/edit', async (req, res) => {
    var { username } = req.params;
    var user = await User.findOne({ username });
    res.render('users/editUser', { user });
})

app.patch('/user/:username', async (req, res) => {
    var { username } = req.params;
    var { bio, backgroundUrl, gifUrl, profilePicUrl } = req.body;
    var user = await User.findOneAndUpdate({ username }, { bio, backgroundUrl, gifUrl, profilePicUrl });
    res.redirect(`/user/${username}`);
})

app.delete('/user/:username', async (req, res) => {
    var { username } = req.params;
    var user = await User.findOneAndDelete({ username });

    res.redirect('/');
})



app.get('/login', async (req, res) => {
    res.render('users/login', { message });
})



app.listen(3000, () => {
    console.log('I AM ON PORT 3000');
})