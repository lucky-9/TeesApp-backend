const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const {signout, signup, signin, isSignedin} = require("../controller/auth");


router.post("/signup",[
    // ...some other validations...
  check("name").isLength({min:3}).withMessage("name should be atleast 3 characters"),
  check("password").isLength({min:5}).withMessage("password should be atleast 5 characters"),
  check("email").isEmail().withMessage("should be a valid email")
  ], signup);


  router.post("/signin",[
    // ...some other validations...
  check("password").isLength({min:5}).withMessage("password should be atleast 3 characters"),
  check("email").isEmail().withMessage("should be a valid email")
  ], signin);




router.get("/signout", signout);

//Protected Routes

router.get("/testroute", isSignedin, (req, res) =>{
    res.json(req.auth)
})





module.exports = router;