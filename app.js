const express=require('express');
const morgan=require('morgan')
const mongoose=require('mongoose');
const { result } = require('lodash');
const blogRoutes=require('./routes/blogRoutes')

//invoking to create an instance of express app
require('dotenv').config();

const app=express();


// const db = 'mongodb+srv://siddarth:siddarthmongodb@cluster0.axazbkg.mongodb.net/nodetuts';
const db = process.env.MONGO_URI;

mongoose.connect(db)
.then((result)=>{
    console.log('successful connected to db')
})
.catch((err)=>{
    console.log(err)
})

app.get('/add-blog',(req,res)=>{
    const blog= new Blog({
        title:'new blog3',
        snippet:'about new blog',
        body:'this is my blog kiddos'
    })

    blog.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        })
})

app.get('/all-blogs',(req,res)=>{
    Blog.find()
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err)
        })
})
//It tells Express to serve static files (like CSS, images, JS) from a folder named public.
// ✅ express.static('public') serves files like CSS, JS, images from the /public folder
// ⛔ You don’t need to write /public in HTML paths — just use root (e.g., /style.css)

// ✅ These tags are only used in HTML or EJS templates:
// <!-- <link rel="stylesheet" href="/style.css">  -->  // Loads CSS
// <!-- <script src="/app.js"></script>            -->  // Loads JavaScript
// <!-- <img src="/logo.png">                      -->  // Displays image

// ❗These are for the browser — not used in backend JS files
app.use(express.static('public'));
app.use(express.urlencoded())
app.use(morgan('dev'));

// app.use((req,res,next)=>{

//     console.log( 'new req made:');
//     console.log('host:',req.hostname);
//     console.log('path:',req.path);
//     console.log('mehthod',req.method);
//     next(); 
// }
// )

//register view engine
// app.set(key, value),“Use EJS to render views (templates).”
//template engine that lets you dynamically generate HTML pages using JavaScript-like syntax inside your .html, .ejs, .pug, etc. files.

app.set('view engine','ejs')
// app.set('views','myviews')--.used when with diffrent folder


//same as server.lsiten here automatically use local host
app.listen(3001)

app.get('/',(req,res)=>{
    //write and end instead ,send automatically sets the content-type header and status code
    // res.send('<p>hello from app</p>')
    res.redirect('/blogs')
})

//all blog routers 

app.use('/blogs',blogRoutes)

app.get('/about',(req,res)=>{
    res.render('about', {title:'About'})
})




//redirects
// app.get('/about-us',(req,res)=>{
//     res.redirect('/about')
// })

////404-->use function will be fires for every request coming in,
////only if the rey reaches this point int the code
//the code runs from to top to bottom and searches if any path matches and fires that callback function,
//if something matches it stops the exec there itself

app.use((req,res)=>{
    //in this case it cant isentify statuscode to 404,we need to do it manually

    res.status(404).render('404',{ title: '404 - Page Not Found' })
})
//this is not with a particular url,so the postition of it matters
//

//logger,authentication,parse JSON data from req,return 404 pages