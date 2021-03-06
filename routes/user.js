const express = require("express");
const { check } = require('express-validator');
const router = express.Router();

const {getUserById, getUser, getUsers, updateUser} = require("../controller/user");
const {isSignedin, isAdmin, isAuthenticated} = require("../controller/auth");


router.param("userId", getUserById);
router.get("/user/:userId",isSignedin, isAuthenticated, getUser);
router.put("/user/:userId",isSignedin, isAuthenticated, updateUser);
router.get('/users', getUsers);



module.exports = router;


