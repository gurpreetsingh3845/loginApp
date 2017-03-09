var bcryptjs = require("bcryptjs"); 
var path =  require("path");
var bodyParser= require("body-parser"); 
var cookieParser= require("cookie-parser"); 
var express= require("express"); 
var exphbs= require("express-handlebars"); 
var expressMessages= require("express-messages"); 
var session= require("express-session"); 
var expressValidator= require("express-validator"); 
var mongodb= require("mongodb"); 
var mongoose= require("mongoose"); 
var passport= require("passport"); 
var flash = require("flash"); 
var passportHttp= require("passport-http"); 
var passportLocal = require("passport-local").Strategy; 
//mongoose.connect("mongodb://localhost/loginapp");

var routes = require('./routes/index');
var users   = require('./routes/users');
var app =  express();

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true	
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(flash());


app.use(function(req,res,next){
	res.locals.success_msg=  req.flash('success_msg');
	 res.locals.errors_msg=  req.flash('errors_msg');
	res.locals.errors=  req.flash('errors');
  res.locals.user =req.user || null;
	next();  
});

app.use('/',routes);

app.use('/users',users);
app.set('port',(process.env.PORT||3000));
app.listen(app.get('port'),function(){
	console.log("sever sart at port :"+app.get('port'));
})


