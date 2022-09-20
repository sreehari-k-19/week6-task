const express = require('express');
const router = express.Router();
const helper = require('../helper/helpfile')

const credential = {
    email: "admin@gmail.com",
    password: "123"
}

router.get('/', (req, res, next) => {
    if (req.session.admin) {
        helper.fetchDetails().then((details) => {
            res.render('admin/view-admin', { admin: true, details });

        })
        // res.redirect('/adminview');

    } else {
        res.render('admin/login', { "loginErr": req.session.adminloginErr })
        req.session.adminloginErr = false;

    }
})
// router.get('/adminview', (req, res) => {
//     helper.fetchDetails().then((details) => {
//         res.render('admin/view-admin', { admin: true, details });

//     })
// })

router.post('/adminlogin', (req, res) => {
    console.log("adminloginnn")
    if (req.body.email == credential.email && req.body.password == credential.password) {
        req.session.admin = req.body.email;
        req.session.adminloggedIn = true

        res.redirect('/admin');
    } else {
        req.session.adminloginErr = "Invalid username or password";

        res.redirect('/admin');
    }
});
router.get('/delete-user/:id', (req, res) => {
    console.log("delete request")
    let userid = req.params.id
    helper.deleteUser(userid).then((response) => {
        res.redirect('/admin')
    })
})
router.get('/edit-user/:id', async (req, res) => {
    if (req.session.admin) 
    {
        let user = await helper.getUser(req.params.id)
        res.render('admin/edit-user', { user })
    } else {
        res.redirect('/admin')

    }
})
router.post('/edit-user/:id', (req, res) => {
    helper.updateUser(req.params.id, req.body).then(() => {
        res.redirect('/admin')
    })
})
router.get('/adminlogout', (req, res) => {
    req.session.admin = null
    res.redirect('/admin')
})
module.exports = router;
