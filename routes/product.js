const express = require("express");
const router = express.Router();

const {getProductById, getProduct,photo, getProducts, updateProduct, createProduct, removeProduct} = require("../controller/product");
const {isAdmin, isAuthenticated, isSignedin} = require('../controller/auth');
const {getUserById} = require('../controller/user');


router.param("userId", getUserById);
router.param("productId", getProductById);

//Read Routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get('/products', getProducts);

//Create Routes
router.post('/product/create/:userId', isSignedin, isAuthenticated, isAdmin, createProduct);

//Update Routes
router.put("/product/:productId/:userId",isSignedin, isAuthenticated,isAdmin, updateProduct);

//Delete Routes
router.delete('/product/:productId/:userId', isSignedin, isAuthenticated, isAdmin, removeProduct);


module.exports = router;


