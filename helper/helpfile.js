const db = require('../config/connection')
const colletiondb = require('../config/collections')
const bcrypt = require('bcrypt');
const { response } = require('express');
const objectId = require('mongodb').ObjectId
const { check, validationResult } = require('express-validator');


module.exports = {

    fetchDetails: () => {
        return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(colletiondb.user_collection).find().toArray()
            resolve(details)
        })
    },
    userDetails: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(colletiondb.user_collection).findOne({ email: userData.email })
            console.log(user)
            
            if(user==null){
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(colletiondb.user_collection).insertOne(userData).then((data) => {
                    resolve(data)
                })
            }else{
                reject()

        }
        })
    },
    login: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(colletiondb.user_collection).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login scsss");
                        response.user = user
                        response.status = true
                        resolve(response)
                        console.log("login scsss");
                    } else {
                        console.log("logone failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failedddd");
            }
        })
    },
    deleteUser:(userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(colletiondb.user_collection).deleteOne({ _id: objectId(userid) }).then((response)=> {
                resolve(response);
            })
        })
    },
    getUser:(userid)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(colletiondb.user_collection).findOne({_id:objectId(userid)}).then((user)=>{
            resolve(user)
        })
      })  
    },
    updateUser:(userid,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(colletiondb.user_collection).updateOne({_id:objectId(userid)},{
                $set:{
                    name:userDetails.name,
                    email:userDetails.email,
                    place:userDetails.place,
                    age:userDetails.age
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    signupValidation:[
        check('name', 'Name is required')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage('This name must me 3+ characters long'),
        check('email', 'Email is required')
            .isEmail()
            .normalizeEmail(),
        check('password', 'Password is requried')
            .isLength({ min: 3 })
            .custom((password, { req, loc, path }) => {
                if (password !== req.body.confirm_password) {
    
                    throw new Error("Passwords don't match");
                } else {
                    return password;
    
                }
            }),
    ]

}
