require("dotenv").config(); 
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./db/conn");

//setting up the server
const app = express();
const port = process.env.PORT || 3000

//setting up the router
const router = new express.Router();
const loginRouters = require("./routers/login");

// setting up the engine and path of the html file
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// setting up the view engine, routers , and use express.json() to identify the pure json data form the database
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(loginRouters);


// creating the jwt token
const createToken = async() => {
    const token = await jwt.sign({_id : "66dd85257b6c00b9488174df"}, "andnfjfnhfjsjfjfjfugdnfjdshfiodnjkdvkjnjdfnvjxndjkcnijefnvk", { expiresIn : "2 seconds"});
    console.log(token);
    
    const userverify = await jwt.verify(token, "andnfjfnhfjsjfjfjfugdnfjdshfiodnjkdvkjnjdfnvjxndjkcnijefnvk");
    console.log(userverify);
}

// createToken();

// listening the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
