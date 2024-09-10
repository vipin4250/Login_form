const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Registers = require("../models/registers");
const auth = require("../middleware/auth");

/**
 * GET /
 * Home page
 */
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/secret",auth, async(req, res) => {
    // console.log(`This is the cookie : ${req.cookies.jwt}`);

    res.render("secret");
})

router.get("/logout", auth, async(req, res) => {
    try {
        console.log(req.rootUser);

        const logoutOption = req.query.logoutOption;
        if(logoutOption === "allDevice"){
            // logout from all device
            req.rootUser.tokens = [];
        } else if(logoutOption === "currentDevice"){
            // logout from current device
            req.rootUser.tokens = req.rootUser.tokens.filter((curElem) => {
                return curElem.token !== req.token;
            });
        } else {
            return res.status(400).send({"error": "Please provide valid logout option"});
        }

        // logout from current device
        // req.rootUser.tokens = req.rootUser.tokens.filter((curElem) => {
        //     return curElem.token !== req.token;
        // })

        // logout from all device
        // req.rootUser.tokens = [];
        
        res.clearCookie("jwt");

        await req.rootUser.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

/**
 * GET /register
 * Registration form
 */
router.get("/register", (req, res) => {
    res.render("register");
})
/**
 * GET /login
 * Login form
 */
router.get("/login", (req, res) => {
    res.render("login");
})

/**
 * POST /register
 * Register a new user
 */
router.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        if(password === cpassword)
        {
            const RegisterPerson = new Registers({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                gender: req.body.gender
            })

            const token = await RegisterPerson.generateAuthToken();
            
            res.cookie("jwt", token, {
                expires : new Date(Date.now() + 600000),
                httpOnly : true
                // secure: true
            });
            console.log("this is cookie : " + cookie);

            const registered = await RegisterPerson.save();
            res.status(201).render("login");
        }
        else{
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * POST /login
 * Login a user
 */
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const userEmail = await Registers.findOne({ email: email });
        if (!userEmail) {
            return res.status(400).send("The email is not valid.");
        }

        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (!isMatch) {
            return res.status(400).send("Email or password is invalid or not matching.");
        }

        // Generate token only if the password is valid
        const token = await userEmail.generateAuthToken();
        // console.log(token);

        res.cookie("jwt", token, {
            expires : new Date(Date.now() + 30000),
            httpOnly : true
            // secure: true
        });


        // Render the home page if login is successful
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(`This is the error: ${error}`);
    }
});


module.exports = router;
