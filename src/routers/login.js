const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Registers = require("../models/registers");

/**
 * GET /
 * Home page
 */
router.get("/", (req, res) => {
    res.render("index");
});

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
        console.log(token);

        // Render the home page if login is successful
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(`This is the error: ${error}`);
    }
});


module.exports = router;
