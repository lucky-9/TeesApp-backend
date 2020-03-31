const Catogery = require("../models/catogery");


exports.getCatogeryById = (req, res, next, id) =>{
    Catogery.findById(id).exec((err, cate) =>{
        if(err || !cate){
            return res.status(404).json({
                error:"Catogery not found in DataBase"
            })
        }
        req.catogery = cate;
        next();
    })
};

exports.createCatogery = (req, res) =>{
    const catogery = new Catogery(req.body);
    catogery.save((err, catogery) =>{
        if(err){
            return res.status(400).json({
                error:"catogery is not saved!!!"
            })
        }
        res.json({catogery});
    })
}


exports.getCatogery = (req, res) =>{
    return res.json(req.catogery);
}

exports.getCatogeries = (req, res) =>{
    Catogery.find().exec((err, catogeries) =>{
        if(err){
            return res.status(400).json({
                error:"catogeries not found"
            })
        }
        return res.json(catogeries);
    })
}

exports.updateCatogery = (req, res) =>{
    const catogery = req.catogery;
    catogery.name = req.body.name;

    catogery.save((err, updatedCatogery) =>{
        if(err){
            return res.status(400).json({
                error:"catogery not updated"
            })
        }
        res.json(updatedCatogery);
    });
}

exports.removeCatogery = (req, res) =>{
    const catogery = req.catogery;

    catogery.remove((err, catogery) =>{
        if(err){
            return res.status(400).json({
                error:"failed to delete catogery"
            })
        }
        res.json({
            message:`${catogery.name} succesfully deleted`
        });
    })
}