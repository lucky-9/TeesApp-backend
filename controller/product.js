const Product = require("../models/product");
const formidable = require("formidable");
const _= require("lodash");
const fs = require("fs"); 


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
      .populate("category")
      .exec((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Product not found"
          });
        }
        req.product = product;
        next();
      });
  };

exports.createProduct = (req, res) =>{
    console.log("Inside create product Method");
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) =>{
        if(err){
            res.status(400).json({
                error:"Problem with the image!"
            });
        }
            console.log("Inside parsing...!");
            //Todo: restrictions on fields
            const {name, stock, description, price, catogery} = fields;
            if(
                !name||
                !stock||
                !description||
                !price||
                !catogery
            ){
                return res.send(400).json({
                    error:"please include all the fields!"
                })
            }


            let product = new Product(fields);

            //handlefile here
            if(files.photo){
                if(files.photo.size > 3000000){
                    return res.status(400).send({
                        error:"Image size is so big!!"
                    })
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type
            }
            console.log(product);
            product.save((err, product) =>{
                if(err){
                    return res.status(400).json({
                        error:"error saving product in DB"
                    })
                }
                res.json(product);
            })
        
        })
}



exports.getProduct = (req, res) =>{
    req.product.photo=undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) =>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


exports.getProducts = (req, res) =>{
    let limit = req.query.limit?parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy?req.query.sortBy:"_id";
    Product.find()
    .populate("catogery")
    .select("-photo")
    .limit(limit)
    .exec((err, products) =>{
        if(err){
            return res.status(400).json({
                error:"products not found"
            })
        }
        return res.json(products);
    })
}

exports.updateProduct = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) =>{
        if(err){
            res.status(400).json({
                "error":"Problem with the image!"
            });
        }
            console.log("Inside parsing...!");
            //Todo: restrictions on fields


            let product = req.product;
            product = _.extend(req.product, fields);
            //handlefile here
            if(files.photo){
                if(files.photo.size > 3000000){
                    return res.status(400).send({
                        "error":"Image size is so big!!"
                    })
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type
            }
            //console.log(product);
            product.save((err, product) =>{
                if(err){
                    return res.status(400).json({
                        "error":"updation of product failed in DB"
                    })
                }
                res.json(product);
            })
        
        })
    
}

exports.removeProduct = (req, res) =>{
    const product = req.product;

    product.remove((err, product) =>{
        if(err){
            return res.status(400).json({
                error:"failed to delete product"
            })
        }
        res.json({
            message:`${product.name} succesfully deleted`
        });
    })
}


exports.updateStock =(req, res, next) =>{
    let myOperations = req.body.order.products.map(prod =>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, (err, products) =>{
        if(err){
            return res.status(400).send({
                error:"Bulk Operation Failed"
            })
        }
        next();
    })
    
}