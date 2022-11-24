const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePicUrl: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
    },
    gifUrl: {
        type: String,
        default: 'https://media0.giphy.com/media/LbBSU26sSRAE8/giphy.gif'
    },
    backgroundUrl: {
        type: String,
        default: 'https://media0.giphy.com/media/3ohhwBL1q1I66srvAA/giphy.gif'
    },
    bio: {
        type: String,
        default: 'This is my bio.'
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;