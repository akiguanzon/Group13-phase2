const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ['School', 'Music', 'Travel', 'Gaming', 'Art'],
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true,
        index: true
    },
    comments: [
        {
            username: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    imgSrc: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png'
    },
    url: {
        type: String,
        required: true
    }
})

postSchema.methods.formatDate = function (dateProperty) {

    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November",
        "December"
    ]

    const newDate = new Date(dateProperty);
    var day = monthNames[newDate.getMonth()];
    let formattedDate = `${day} `;  // for double digit month
    formattedDate += `${`${newDate.getDate()}`}, `;        // for double digit day
    formattedDate += `${newDate.getFullYear()}`;
    return formattedDate;
}

postSchema.index({ title: 'text', category: 'text', username: 'text', content: 'text' })
const Post = mongoose.model('Post', postSchema);
Post.createIndexes();

module.exports = Post;