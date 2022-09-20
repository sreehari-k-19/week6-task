const { response } = require('express');
const express = require('express');
const router = express.Router();
const helper = require('../helper/helpfile')
const { check, validationResult } = require('express-validator');

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/welcome');
    } else {
        res.render('login', { "loginErr": req.session.loginErr });
        req.session.loginErr = false;
    }
})
router.get('/', (req, res, next) => {
    res.redirect('/login');
})
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/welcome')
    } else {
        res.render('user/signup', {
            "signuperr": req.session.signpErr,
            success: req.session.success,
            errors: req.session.errors
        })
        req.session.errors = null;
        req.session.signpErr = false;
    }

})
router.get('/welcome', (req, res) => {
    let user = req.session.user
    if (user) {
        res.render('user/welcome', { user })
    } else {
        res.redirect('/')
    }
})
router.post('/signup', helper.signupValidation, (req, res) => {
    var error = validationResult(req);
    if (!error.isEmpty()) {
        const errors = error.array()
        req.session.errors = errors;
        req.session.success = false
        console.log("validat fail");

        res.redirect('/signup')
    } else {
        console.log("validat scsss");
        req.session.success = true;
        helper.userDetails(req.body).then((response) => {
            console.log("responsepssse");
            req.session.loggedIn = true
            req.session.user = req.body;
            res.redirect('/welcome')
        }).catch((response) => {
            console.log(response)
            console.log("signup not done");
            req.session.signpErr = "Email already exist";

            res.redirect('/signup')
        })
    }


})
router.post('/login', (req, res) => {
    helper.login(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true
            req.session.user = response.user

            res.redirect('/welcome')
        } else {
            req.session.loginErr = "Invalid username or password";
            res.redirect('/login')
        }
    })
})
router.get('/logout', (req, res) => {
    req.session.destroy()
    // req.session.user=null
    res.redirect('/')
})

module.exports = router;