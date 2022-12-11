var Post = require('../model/post');
var User = require('../model/user');

const controllerhome = {
    goHome: async(req, res) => {
        message = '';
        // if(req.session.username){
            let posts = await Post.find({}).sort({ 'views': -1 });
            let latestPosts = await Post.find({}).sort({ 'date': -1 });
            posts = posts.slice(0, 5);
            latestPosts = latestPosts.slice(0, 5);
            res.render('home', { posts, latestPosts });
        // }
        // else{
        //     message = 'Login to proceed.';
        //     console.log('Login to proceed.');
        //     res.redirect('/login');
        // }
    }
}

module.exports = controllerhome;