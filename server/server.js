const express = require("express");
const next = require("next");
const appNext = next({
    dev: true, 
    dir: "./"
});

appNext
    .prepare()
    .then(() => {
        setTimeout(() => {
            console.log('timeout');
        }, 0);
        
        setImmediate(() => {
            console.log('immediate');
        });
        const server = express();
        const router = express.Router();
        const bodyParser = require('body-parser');
        const session = require("express-session");
        const SessionFileStore = require("session-file-store");
        const FileStore = SessionFileStore(session);
        const redis = require('redis');
        const redisStore = require('connect-redis')(session);
        const client  = redis.createClient();
        const secret = "hihihi";

        server.use(bodyParser.json());      
        server.use(bodyParser.urlencoded({extended: true}));

        // SESSION
        // server.use(session({
        //     secret: secret,
        //     // create new redis store.
        //     store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
        //     saveUninitialized: false,
        //     resave: false
        // }));
        server.use(
            session({
                secret: secret,
                saveUninitialized: true,
                store: new FileStore({
                path: "/tmp/sessions",
                secret: secret,
                }),
                resave: false,
                rolling: true,
                cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                },
            }),
        );

        server.get('/test/:text',(req,res) => {
            appNext.render(req, res, '/test', { text: req.params.text });
        });
        
        router.get('/',(req,res) => {
            let sess = req.session;
            if(sess.email) {
                return res.redirect('/admin');
            }
            console.log("INDEX");
            res.sendFile(__dirname + '/index.html');
        });
        
        router.post('/login',(req,res) => {
            console.log("LOGIN", req.body, req.session);
            req.session.email = req.body.email;
            res.end('done');
        });
        
        router.get('/admin',(req,res) => {
            if(req.session.email) {
                res.write(`<h1>Hello ${req.session.email} </h1><br>`);
                res.end('<a href='+'/logout'+'>Logout</a>');
            }
            else {
                res.write('<h1>Please login first.</h1>');
                res.end('<a href='+'/'+'>Login</a>');
            }
        });
        
        router.get('/logout',(req,res) => {
            req.session.destroy((err) => {
                if(err) {
                    return console.log(err);
                }
                res.redirect('/');
            });
        
        });
        
        server.use('/', router);

        server.get("*", appNext.getRequestHandler());

        server.listen(3100, () => {
            console.info("Server Ready !!!!!");
        })
    });