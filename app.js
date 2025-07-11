const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const Blog = require('./models/blog');
require('dotenv').config();

// invoking to create an instance of express app
const app = express();

// const db = 'mongodb+srv://siddarth:siddarthmongodb@cluster0.axazbkg.mongodb.net/nodetuts';
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db)
  .then(() => {
    console.log('✅ MongoDB is vibing. Connected successfully! 🚀');
  })
  .catch((err) => {
    console.log('❌ MongoDB ghosted us. Connection failed:', err);
  });

// It tells Express to serve static files (like CSS, images, JS) from a folder named public.
// ✅ express.static('public') serves files like CSS, JS, images from the /public folder
// ⛔ You don’t need to write /public in HTML paths — just use root (e.g., /style.css)

// ✅ These tags are only used in HTML or EJS templates:
// <!-- <link rel="stylesheet" href="/style.css">  -->  // Loads CSS
// <!-- <script src="/app.js"></script>            -->  // Loads JavaScript
// <!-- <img src="/logo.png">                      -->  // Displays image

// ❗These are for the browser — not used in backend JS files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// app.use((req,res,next)=>{
//     console.log( 'new req made:');
//     console.log('host:',req.hostname);
//     console.log('path:',req.path);
//     console.log('mehthod',req.method);
//     next(); 
// })

// register view engine
// app.set(key, value),“Use EJS to render views (templates).”
// template engine that lets you dynamically generate HTML pages using JavaScript-like syntax inside your .html, .ejs, .pug, etc. files.
app.set('view engine', 'ejs');
// app.set('views','myviews') -- used when working with a different folder

// same as server.listen, here it automatically uses localhost
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server vibin’ on port ${PORT}`));

// root route
app.get('/', (req, res) => {
  console.log('🏠 Root route hit! Sending user to /blogs ✨');
  // res.send('<p>hello from app</p>')
  res.redirect('/blogs');
});

// temporary route to add a blog manually
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'Just dropped: 🔥 New Blog',
    snippet: 'spillin’ some fresh thoughts 💭',
    body: 'yo fam, peep this fire blog post. thoughts = unleashed 🚀'
  });

  blog.save()
    .then((result) => {
      res.send(`✅ Blog saved to the vault:
${JSON.stringify(result, null, 2)}`);
    })
    .catch((err) => {
      console.log('🛑 Saving blog flopped:', err);
    });
});

// route to get all blogs
app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(`📚 Here’s the full tea (a.k.a. blogs):
${JSON.stringify(result, null, 2)}`);
    })
    .catch((err) => {
      console.log('📛 Couldn’t fetch the vibes:', err);
    });
});

// all blog routers
app.use('/blogs', blogRoutes);

// about page
app.get('/about', (req, res) => {
  res.render('about', { title: '👀 About This Vibe' });
});

// redirects
// app.get('/about-us',(req,res)=>{
//     res.redirect('/about')
// })

//// 404 --> use function will be fired for every request coming in,
//// only if the req reaches this point in the code
//// the code runs from top to bottom and searches if any path matches and fires that callback function,
//// if something matches it stops the exec there itself

// this is not with a particular url, so the position of it matters
app.use((req, res) => {
  // in this case it can't identify status code to 404, we need to do it manually
  res.status(404).render('404', { title: '🧍‍♂️ 404 - Page Went Poof 💨' });
});

// logger, authentication, parse JSON data from req, return 404 pages
