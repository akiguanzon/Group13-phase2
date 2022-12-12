const mongoose = require('mongoose');
const Post = require('./post');


mongoose.connect('mongodb://localhost:27017/group13DB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!')
        console.log(err)
    })


const currentPosts = [

    {
        username: 'AveryMann2000',
        title: 'Musician Rex Orange County reportedly charged with six counts of sexual assault, denies allegations',
        category: 'Music',
        date: '2022-10-11',
        content: "Singer Rex Orange County got charged with SA.",
        comments: [
            {
                username: 'SallyAnon',
                body: 'Oh gosh! Sending my prayer to the victim :(',
                date: '2022-11-01'
            }
        ],
        views: 46,
        imgSrc: 'https://github.com/akiguanzon/Group13_MP/blob/main/samplepostpages/rex.jpg?raw=true',
        url: 'https://www.abc.net.au/news/2022-10-11/rex-orange-county-alex-oconner-sexual-assault-allegations/101524296'
    },
    {
        username: 'John_Doe',
        title: 'Impact of the COVID-19 pandemic on teaching and learning in health professional education: a mixed methods study protocol',
        category: 'School',
        date: '2022-03-01',
        content: "The unexpected pandemic has brought multiple challenges to students and teachers. This study evaluates possible approaches to online teaching. It also assesses the feasibility, benefits, and shortcomings of online learning based on student's performance.",
        comments: [
            {
                username: 'SallyAnon',
                body: 'Good read',
                date: '2022-03-04'
            },
            {
                username: 'SmithJane',
                body: 'I wish that the pandemic is over :(',
                date: '2022-05-04'
            }
        ],
        views: 38,
        imgSrc: 'https://github.com/akiguanzon/Group13_MP/blob/main/samplepostpages/pandemic.jpg?raw=true',
        url: 'https://bmcmededuc.biomedcentral.com/articles/10.1186/s12909-021-02871-w'
    },
    {
        username: 'John_Doe',
        title: 'Video Games May Trigger Rare Heart Attacks in Kids: Study',
        category: 'Gaming',
        date: '2022-10-13',
        content: "A 16 year old died from a heart attack while playing video games in 2013. Is playing video games harmful now? This articles showed some statistics on some gamer's health. Most gamers who experienced sudden loss of consciousness while playing video games and were determined to have underlying heart conditions.",
        comments: [
            {
                username: 'xXAntonImus19Xx',
                body: 'Thanks for sharing this article!',
                date: '2022-10-14'
            },
            {
                username: 'SallyAnon',
                body: ':O',
                date: '2022-10-14'
            },
            {
                username: 'SmithJane',
                body: 'This article is a good read!',
                date: '2022-10-15'
            }
        ],
        views: 54,
        imgSrc: 'https://github.com/akiguanzon/Group13_MP/blob/main/samplepostpages/gamer.jpg?raw=true',
        url: 'https://www.webmd.com/children/news/20221012/video-games-may-trigger-rare-heart-attacks-kids-study'
    },
    {
        username: 'AveryMann2000',
        title: '5 top tips for your UK visa application, as per travel agents',
        category: 'Travel',
        date: '2022-10-04',
        content: "This article gives tips on a smooth visa application for the UK.",
        comments: [
            {
                username: 'SmithJane',
                body: 'Thank you for sharing!!!!!',
                date: '2022-10-07'
            }
        ],
        views: 28,
        imgSrc: 'https://github.com/akiguanzon/Group13_MP/blob/main/samplepostpages/uk.jpg?raw=true',
        url: 'https://www.cntraveller.in/story/5-top-tips-for-your-uk-visa-application-as-per-travel-agents/'
    },
    {
        username: 'AveryMann2000',
        title: 'Man disguised as old woman attacks the Mona Lisa painting with cake',
        category: 'Art',
        date: '2022-06-06',
        content: 'An environmental activist disguised as an old lady and attacked Mona Lisa painting with cake. Apparantly, this is to bring awareness to climate change.',
        comments: [
            {
                username: 'xXAntonImus19Xx',
                body: 'Yikessssss',
                date: '2022-06-07'
            },
            {
                username: 'SallyAnon',
                body: 'Oh gosh! Good thing there is a glass cover :(',
                date: '2022-06-08'
            }
        ],
        views: 100,
        imgSrc: 'https://github.com/akiguanzon/Group13_MP/blob/main/samplepostpages/mona-lisa-attack.png?raw=true',
        url: 'https://www.brusselstimes.com/230499/man-disguised-as-old-woman-attacks-the-mona-lisa-painting-with-cake'
    },
]

Post.insertMany(currentPosts)
    .then(res => {
        console.log("it worked!");
    })
    .catch(err => {
        console.log("it failed");
        console.log(err);
    })