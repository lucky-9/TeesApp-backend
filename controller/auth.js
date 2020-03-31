const User = require('../models/user');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { check, validationResult } = require('express-validator');

exports.signup = (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    const user = new User(req.body);
    user.save((err, user) =>{ 
        if(err){
            return res.status(400).json({
                err:"user already exists"
            })
        }
        res.json({
            name:user.name,
            lastname:user.lastname,
            email:user.email
        })
     });  
}


exports.signin = (req, res) =>{
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            err:errors.array()[0].msg
        })
    }
    User.findOne({email}, (err, user) =>{
        if(err || !user){
            return res.status(401).json({
                err:"user not found!"
            })
        }
        // if(!user){
        //     return res.status(401).json({
        //         err:"you don't have an accound please signup!"
        //     })
        // }
        if(!user.autheticate(password)){
            return res.status(401).json({
                err:"email and password do not match"
            })
        } 
        //CREATE TOKEN
        const token = jwt.sign({_id:user.id}, process.env.SECRET);
        res.cookie("token",token, {expire: new Date()+999});
        //send response to frontend
        const {name, role, email, _id} = user;
        res.json({
            token,  
            _id,
            user:{
                name,
                role,
                email
            }
        })
    });
}


exports.signout = (req, res) =>{
    res.clearCookie("token");
    res.json({
        "message":"user signed out succesfully"
    });
};


//Protected Routes

exports.isSignedin = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
})

//Custom MiddleWares
exports.isAuthenticated= (req, res, next) =>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
       return res.status(403).json({
           error:"ACCESS DENIED"
        });
    }
    next();
}

exports.isAdmin= (req, res, next) =>{
    if(req.profile.role === 0){
       return res.status(403).send("you are not Admin, only ADMINS can view this page");
    }
    next();
}


