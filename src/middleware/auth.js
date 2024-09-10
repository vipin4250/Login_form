require("dotenv").config(); 
const jwt = require("jsonwebtoken");
const Registers = require("../models/registers");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await Registers.findOne({_id: verifyUser._id, "tokens.token": token});
        console.log(rootUser);
        req.token = token;
        req.rootUser = rootUser;
        console.log("This is the verifyUser:", verifyUser);


        next();

    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;
