const express = require("express");
const router = express.Router();

const {getCatogeryById, getCatogery, getCatogeries, updateCatogery, createCatogery, removeCatogery} = require("../controller/catogery");
const {isAdmin, isAuthenticated, isSignedin} = require('../controller/auth');
const {getUserById} = require('../controller/user');


router.param("userId", getUserById);
router.param("catogeryId", getCatogeryById);


router.post('/catogery/create/:userId', isSignedin, isAuthenticated, isAdmin, createCatogery);
router.get("/catogery/:catogeryId/:userId",isSignedin, isAuthenticated, getCatogery);
router.put("/catogery/:catogeryId/:userId",isSignedin, isAuthenticated,isAdmin, updateCatogery);
router.get('/catogeries', getCatogeries);
router.delete('/catogery/:catogeryId/:userId', isSignedin, isAuthenticated, isAdmin, removeCatogery)


module.exports = router;


