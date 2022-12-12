var Post = require('../model/post');
var categories = ['School', 'Music', 'Travel', 'Gaming', 'Art'];
const mongoose = require('mongoose');

function isValidUrl(data) {
    let url;
    try {
        url = new URL(data)
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:"
}

const controllerpost = {
    //Show featured posts
    featuredPosts: async (req, res) => {
        var q = "Featured"
        var searchPosts = await Post.find({}).sort({ 'views': -1 });
        res.render('posts/search', { q, searchPosts });
    },

    //Show latest posts
    latestPosts: async (req, res) => {
        var q = "Latest";
        var searchPosts = await Post.find({}).sort({ 'date': -1 });
        res.render('posts/search', { q, searchPosts });
    },

    //Show posts page
    postsPage: async (req, res) => {
        const { id } = req.params;
        var post = await Post.findById(id)
            .then((post) => {
                res.render('posts/postPage', { post, message });
            })
            .catch(() => {
                res.redirect('/');
            })
        message = '';
    },

    //Show posts searched
    searchPosts: async (req, res) => {
        var { q } = req.query;
        var searchPosts = await Post.find({ $text: { $search: q } });
        res.render('posts/search', { q, searchPosts });
    },

    //Show posts by categories
    categoryPosts: async (req, res) => {
        var { category: q } = req.params;
        var searchPosts = await Post.find({ "category": q });
        res.render('posts/search', { q, searchPosts });
    },

    //Create post
    newPosts: async (req, res) => {
        if (req.session.username) {
            message = '';
            res.render('posts/newPage', { categories, message });
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Verify new post
    verifyNewPost: async (req, res) => {
        if (req.session.username) {
            var data = req.body;
            data.username = req.session.username;
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
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Edit post
    editPost: async (req, res) => {
        if (req.session.username) {
            const { id } = req.params;
            message = '';
            var categories = ['School', 'Music', 'Travel', 'Gaming', 'Art'];
            var post = await Post.findById(id)
                .then((post) => {
                    if (post.username === req.session.username) {
                        res.render('posts/updatePost', { post, categories, message });
                    }
                    else {
                        message = 'You are not the author of the post.'
                        res.redirect(`/post/${post._id}`)
                    }
                })
                .catch(() => {
                    res.redirect('/');
                })
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Verify edit post
    verifyEditPost: async (req, res) => {
        if (req.session.username) {
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
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Delete post
    deletePost: async (req, res) => {
        if (req.session.username) {
            const { id } = req.params;
            var post = await Post.findById(id);
            if (post.username == req.session.username) {
                await Post.findByIdAndDelete(id)
                    .then(() => {
                        res.redirect('/');
                    })
                    .catch(() => {
                        res.redirect('/');
                    })
            }
            else {
                message = 'You are not the author of the post.'
                res.redirect(`/post/${post._id}`)
            }
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Comments
    comments: async (req, res) => {
        if (req.session.username) {
            var data = req.body;
            data.username = req.session.username;
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
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Update comment
    updateComment: async (req, res) => {
        if (req.session.username) {
            const { id, index } = req.params;
            message = '';
            var post = await Post.findById(id)
                .then(async (post) => {
                    if (post.comments[index].username === req.session.username) {
                        res.render('comments/updateComment', { post, index, message });
                    }
                    else {
                        message = 'You are not the author of the comment.';
                        res.redirect(`/post/${post._id}`)
                    }
                })
                .catch(() => {
                    res.redirect('/');
                })
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //
    comment: async (req, res) => {
        if (req.session.username) {
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
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    },

    //Delete comment
    deleteComment: async (req, res) => {
        if (req.session.username) {
            const { id, index } = req.params;
            console.log(index)
            var post = await Post.findById(id)
                .then(async (post) => {
                    for (let comment of post.comments) {
                        if (comment._id == index) {
                            if (comment.username == req.session.username) {
                                await post.comments.pull(index);
                                console.log(post)
                                await post.save();
                                return post
                            }
                            else {
                                message = 'You are not the author of this comment.'
                                return post;
                            }
                        }
                    }
                })
                .then((post) => {
                    res.redirect(`/post/${post._id}`);
                })
                .catch(() => {
                    res.redirect('/');
                })
        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/login');
        }
    }
}

module.exports = controllerpost;