const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById =(req, res, next, id) =>{
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(404).json({
                error:"user not found in DataBase"
            })
        }
        req.profile = user;
        next();
    })
};


exports.getUser = (req, res) =>{
    req.profile.salt = undefined;
    req.profile.encry_password= undefined;
    return res.json(req.profile);
}


exports.updateUser =  (req, res) =>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set: req.body},
        {new:true},
        ).exec((err, user) =>{
            if(err){
                res.json({
                    error:"user cannot be updated"
                })
            }
            res.json(user)
    });
}

exports.getUsers = (req, res) =>{
   User.find().exec((err, users) =>{
       if(err || !users){
           res.json({
               error:"error getting users"
           })
       }
       res.json(users)
   })
}

exports.userPurchaseList = (req, res) =>{
        Order.find({user:req.profile._id})
        .populate("User", "_id name")
        .exec((err, order) =>{
            if(err){
                res.status(404).json({
                    error:"No Order by this User"
                })
            }
            return res.json(order)
            });
}



exports.pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = [];
    req.body.order.products.forEach((product) =>{
            purchases.push({
                _id:product._id,
                name:product.name,
                category:product.category,
                quantity:product.quantity,
                amount:req.body.order.amount,
                transactionId:req.body.order.transactionId
            })
    })
    //Store in DB
    user.findByIdAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err, purchases) =>{
            if(err){
                return res.status(400).json({
                    error:"unable to save purchaseList"
                })
            }
            next();
        }
    )

}