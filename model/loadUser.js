const mongoose = require('mongoose');
const User = require('./user');


mongoose.connect('mongodb+srv://group13DB:group13DB@group13db.canhgfz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!')
        console.log(err)
    })


const currentUsers = [

    {
        username: "AveryMann2000",
        password: "1234",
        profilePicUrl: "https://m.media-amazon.com/images/I/71AabNyhmSL._AC_UY1000_.jpg",
        gifUrl: "https://media0.giphy.com/media/LbBSU26sSRAE8/giphy.gif",
        backgroundUrl: "https://media0.giphy.com/media/3ohhwBL1q1I66srvAA/giphy.gif",
        bio: "Do not disturb."
    },
    {
        username: "John_Doe",
        password: "1234",
        profilePicUrl: "https://render.fineartamerica.com/images/rendered/default/poster/8/8/break/images/artworkimages/medium/3/american-psycho-hip-to-be-square-bobby-zeik.jpg",
        gifUrl: "https://media.tenor.com/CEOHpTiX1S4AAAAM/gene-kelly-singing-in-the-rain.gif",
        backgroundUrl: "https://media.tenor.com/pbq9x1rQWkEAAAAd/windy-when-sharks-attack.gif",
        bio: "Hello, I’m John Doe and I like to watch movies."
    },
    {
        username: "xXAntonImus19Xx",
        password: "1234",
        profilePicUrl: "https://cdn.shopify.com/s/files/1/1223/6434/files/helmets-072120.jpg?v=1595299148",
        gifUrl: "https://c.tenor.com/q8eKqviSryYAAAAd/burnout-chase-elliott.gif",
        backgroundUrl: "https://media2.giphy.com/media/CKlafeh1NAxz35KTq4/giphy-downsized-large.gif",
        bio: "Where is everybody at?!?!?! Why are people on this website so inactive?"
    },
    {
        username: "SallyAnon",
        password: "1234",
        profilePicUrl: "https://www.netliteracy.org/wp-content/uploads/2020/07/Capture-3-768x758.png",
        gifUrl: "https://thumbs.gfycat.com/ThoroughWickedCowrie-max-1mb.gif",
        backgroundUrl: "https://media2.giphy.com/media/W307DdkjIsRHVWvoFE/giphy.gif",
        bio: "Im SallyAnon, I love music and I love to travel. I'm selling tickets for the big concert, dm me for info."
    },
    {
        username: "SmithJane",
        password: "1234",
        profilePicUrl: "https://www.dlsu.edu.ph/wp-content/uploads/2019/06/logo-dlsu-id-manual-2019.jpg",
        gifUrl: "https://media0.giphy.com/media/6XX4V0O8a0xdS/giphy.gif",
        backgroundUrl: "https://media.tenor.com/vajzsKs7CacAAAAC/library.gif",
        bio: "I created this account to get help for my enrollment problems"
    }

]

User.insertMany(currentUsers)
    .then(res => {
        console.log("it worked!");
    })
    .catch(err => {
        console.log("it failed");
        console.log(err);
    })
