require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const app = express();


//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const catogeryRoutes = require("./routes/catogery");
const productRoutes = require("./routes/product");

//Middlewares
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());

//Routes Middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", catogeryRoutes);
app.use("/api", productRoutes);




mongoose.connect(process.env.DATABASE || "mongodb://localhost:27017/tshirt",{
useNewUrlParser:true,
keepAlive:1,
useCreateIndex:true
}, ()=>{console.log("CONNECTED TO DB")}).catch(error => console.log('db connection error', error));



const PORT = process.env.PORT || 3000;


app.get('/',(req, res) => res.send("In Home Page...."));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));