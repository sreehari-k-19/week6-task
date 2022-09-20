const express=require('express');
const app=express();
const path=require('path');
const port=3000;
const db=require('./config/connection')
const bodyparser = require("body-parser");
const session=require('express-session');
const { v4: uuidv4 } = require("uuid");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json());
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(session({
  secret: uuidv4(), 
  resave: false,
  saveUninitialized: true
}));

const adminRouter=require('./routes/admin');
const userRouter=require('./routes/user');

app.use(express.static(path.join(__dirname,'public')));
var hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

db.connect((err)=>{
  if (err){
    console.log("database error"+err);
  }else{
    console.log("datasbe conneted");
  }
})

app.use('/',userRouter);
app.use('/admin',adminRouter);

// app.get('/', (req, res) => {
//     res.render('home',{admin:false});
// });

app.listen(port,()=>{
    console.log("sever started");
});