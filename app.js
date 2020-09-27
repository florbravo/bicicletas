require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');

const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const Usuario = require('./models/usuario');
const Token = require('./models/token');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usuarios');
const tokenRouter = require('./routes/token');
const biciRouter = require('./routes/bicicletas');

const authAPIRouter = require('./routes/api/auth');
const biciAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');

let store;
if (process.env.NODE_ENV === 'development') {
    store = new session.MemoryStore;
} else {
    store = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: 'sessions',
    });
    store.on('error', function (error){
        assert.ifError(error);
        assert.ok(false);
    });
}

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
    cookie: {maxAge: 240 * 60 * 60 * 1000},
    store: store,
    saveUninitialized: true,
    resave: true,
    secret: 'red_biciletas_!!.."!"-!-"221323'
}));

const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function () {
    console.log('We are connected prod database!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Session
app.get('/login', function (req, res) {
    res.render('session/login');
});
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, usuario, info) {
        if (err) return next(err);
        if (!usuario) return res.render('session/login', {info});
        req.logIn(usuario, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/forgotPassword', function (req, res) {
    res.render('session/forgotPassword');
});
app.post('/forgotPassword', function (req, res) {
    Usuario.findOne({email: req.body.email}, function (err, usuario) {
        if (!usuario) {
            return res.render('session/forgotPassword', {info: {message: 'No existe el email'}});
        }
        usuario.resetPassword(function (err) {
            if (err) return next(err);
            console.log('session/forgotPasswordMessage');
        });

        res.render('session/forgotPasswordMessage');
    });
});
app.get('/resetPassword/:token', function (req, res, next) {
    Token.findOne({token: req.params.token}, function (err, token) {
        if (!token) {
            return res.status(400).send({
                type: 'not-verified',
                msg: 'No existe el usuario asociado a ese token. Verifique que su token no haya expirado'
            });
        }

        Usuario.findById(token._userId, function (err, usuario) {
            if (!usuario) {
                return res.status(400).send({msg: 'No existe el usuario asociado a ese token'});
            }

            res.render('session/resetPassword', {errors: {}, usuario: usuario});
        });
    });
});
app.post('/resetPassword', function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        res.render('session/resetPassword', {
            errors: {
                confirm_password: {message: 'No coinciden las contraseñas'}
            },
            usuario: new Usuario({
                email: req.body.email,
            })
        });
        return;
    }

    Usuario.findOne({email: req.body.email}, function (err, usuario) {
        usuario.password = req.body.password;
        usuario.save(function (err) {
            if (err) {
                res.render('session/resetPassword', {
                    errors: err.errors,
                    usuario: new Usuario({email: req.body.email})
                });
            } else {
                res.redirect('/login');
            }
        });
    });
});


app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/token', tokenRouter);

app.use('/bicicletas', loggedIn, biciRouter);

app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validarUsuario, biciAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

app.use('/privacy_policy', function (req,res) {
    res.sendFile('public/privacy_policy.html');
});

// Google OAuth
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        console.log('user not logged in');
        res.redirect('/login');
    }
}

function validarUsuario(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({status: 'error', message: err.message, data: null});
        } else {
            req.body.userId = decoded.id;
            console.log('jwt verify', decoded);
            next();
        }
    });
}

module.exports = app;
