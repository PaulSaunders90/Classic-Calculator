var express = require('express'),
    app = express(),
    flash = require("connect-flash"),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    mailerhbs = require('nodemailer-express-handlebars'),
    session = require('express-session'),
    sslRedirect = require('heroku-ssl-redirect');


app.set("view engine", "ejs");
app.use(sslRedirect());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: "It's a Secret to Everybody",
    resave: false,
    saveUninitialized: false
}));

var mailer = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.emailname,
        pass: process.env.emailpass
    }
});

mailer.use('compile', mailerhbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: 'templates/emails',
        layoutsDir: 'templates/emails',
        defaultLayout: 'CCReport.hbs',
    },
    viewPath: 'templates/emails',
    extName: '.hbs'
}));


app.get("/", function(req, res) {
    res.render("talent")
});

app.get("/talent", function(req, res) {
    res.render("talent")
});

app.get("/talent/:class/", function(req, res) {
    res.render("talent")
});

app.get("/talent/:class/:talents", function(req, res) {
    res.render("talent")
});

app.get("/suggestion", function(req, res) {
    res.render("suggestion")
});

app.post("/suggestion", function(req, res) {
    mailer.sendMail({
        from: process.env.emailname,
        to: process.env.emailname,
        subject: 'Classic Calculator Report Email',
        template: 'CCReport',
        context: {
            name: req.body.name,
            email: req.body.email,
            page: req.body.page,
            message: req.body.message,
        }
    });
    req.flash("success", "Your Submission Has Been Receieved!");
    res.redirect("talent");
});


app.get('*', function(req, res) {
    res.render("error")
})

app.listen(process.env.PORT || "3000", process.env.IP, function() {
    console.log("App is up");
});