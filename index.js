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

function isValidUrl(data) {
    let url;
    try {
        url = new URL(data)
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:"
}

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
    res.render('posts/newPage', { categories, message });
    message = '';
})

app.post('/posts', async (req, res) => {

    var data = req.body;

    if (!data.title) {
        message = 'Invalid title. Make sure it has more than 5 characters'
        console.log('haha');
        res.redirect('/post/new');
    }
    else if (!isValidUrl(data.url)) {
        message = 'Not a valid url. Please include https:// in the start.'
        res.redirect('/post/new');
    }
    else {
        if (!isValidUrl(data.imgSrc)) {
            data.imgSrc = undefined;
        }
        var newData = new Post(data);
        await newData.save()
            .then(async () => {
                res.redirect('/');
            })
            .catch((err) => {
                message = err;
                res.redirect('/post/new');
            })

    }


})

app.post('/post/:id/comments', async (req, res) => {
    const data = req.body;
    var { id } = req.params;
    var currentPost = await Post.findById(id)
        .then(async (currentPost) => {
            currentPost.comments.push(data);
            await currentPost.save();
        })
        .then(async () => {
            res.redirect(`/post/${id}`);
        }
        )
        .catch(() => {
            message = 'Please input a comment.'
            res.redirect(`/post/${id}`);
        })
})



app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    var post = await Post.findById(id)
        .then((post) => {
            res.render('posts/postPage', { post, message });
        })
        .catch(() => {
            res.redirect('/');
        })

    message = '';
})

app.get('/post/:id/edit', async (req, res) => {
    const { id } = req.params;
    var post = await Post.findById(id)
        .then((post) => {
            res.render('posts/updatePost', { post, categories, message });
        })
        .catch(() => {
            res.redirect('/');
        })

    message = '';
})

app.patch('/post/:id', async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    if (!post.title) {
        message = 'Invalid title. Make sure it has more than 5 characters'
        console.log('haha');
        res.redirect(`/post/${id}/edit`);
    }

    else if (!isValidUrl(post.url)) {
        message = 'Not a valid url. Please include https:// in the start.'
        res.redirect(`/post/${id}/edit`);
    }
    else {
        if (!isValidUrl(post.imgSrc)) {
            post.imgSrc = undefined;
        }
        const { title, url, imgSrc, content, category } = post;
        await Post.findByIdAndUpdate(id, { title, url, imgSrc, content, category }, { runValidators: true })
            .then(({ id }) => {
                res.redirect(`/post/${id}`);
            })
            .catch(() => {
                res.redirect('/');
            })

    }
})





app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id)
        .then(() => {
            res.redirect('/');
        })
        .catch(() => {
            res.redirect('/');
        })

})

app.get('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    var post = await Post.findById(id)
        .then(async (post) => {
            res.render('comments/updateComment', { post, index, message });
        })
        .catch(() => {
            res.redirect('/');
        })

    message = '';
})

app.patch('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    const { body } = req.body;
    var currentPost = await Post.findById(id)
        .then(async (currentPost) => {
            currentPost.comments[index].body = body;
            await currentPost.save();
        })
        .then(async () => {
            res.redirect(`/post/${id}`);
        }
        )
        .catch(() => {
            message = 'Please input a comment.'
            res.redirect(`/post/${id}/comment/${index}`);
        })
})

app.delete('/post/:id/comment/:index', async (req, res) => {
    const { id, index } = req.params;
    var currentPost = await Post.findById(id)
        .then(async (currentPost) => {
            await currentPost.comments.pull(index);
            return currentPost;
        })
        .then(async (currentPost) => {
            await currentPost.save();
        })
        .then(() => {
            res.redirect(`/post/${id}`);
        })
        .catch(() => {
            res.redirect('/');
        })

})


//USERNAMES CONTROLLER

app.get('/signup', async (req, res) => {
    var usernames = await User.find();

    res.render('users/createUser', { usernames, message });
    message = '';
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
})

app.post('/user', async (req, res) => {
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
    res.render('users/editUser', { user, message });

    message = '';
})

app.patch('/user/:username', async (req, res) => {
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


})

app.delete('/user/:username', async (req, res) => {
    var { username } = req.params;
    var user = await User.findOneAndDelete({ username });

    res.redirect('/');
})



app.get('/login', async (req, res) => {
    res.render('users/login', { message });
    message = '';
})



app.listen(3000, () => {
    console.log('I AM ON PORT 3000');
})