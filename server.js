const express= require('express');
const app= express();
const path=require('path');
const PORT = 3000;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ExpressError = require('./views/errorHandling/ExpressError.js');
require('dotenv').config()

const admin = require('./routes/admin');
const guest= require('./routes/guest');
const subscribe = require('./routes/subscribe');

const DB_URL= process.env.ATLAS_URL;

const mongoose = require('mongoose');
main()
  .then(() => {
    console.log("Mongoose connected successfully");
  })
  .catch((err) => {
    console.log("Mongoose connection error:", err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto:{
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 3600,

})
app.use(session({
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
store.on("error",()=>{
  console.log("error in mongo store",err);
})

app.get('/login', (req, res) => {
  res.render('login/login');
});

app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  } 
    return next(new ExpressError('Unauthorized Access', 401));

});

const engine = require('ejs-mate');
app.engine('ejs', engine); 
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('views', path.join(__dirname, 'views'));

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use('/', subscribe);
app.use('/admin',admin);
app.use('/',guest);

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).render('errorHandling/error', { statusCode, message });
});


app.listen(PORT,(req,res)=>{
    console.log('server connected');
});