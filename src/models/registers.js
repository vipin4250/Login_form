const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

loginSchema.methods.generateAuthToken = async function() {
    try {
        const userToken = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);

        this.tokens = this.tokens.concat({ token: userToken });

        await this.save();

        return userToken;
    } catch (error) {
        console.error("Error in generateAuthToken:", error);
        throw new Error(error); // Ensure the error is thrown so it can be caught by the caller
    }
};


loginSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
        // this.confirmPassword = undefined;
    }
    next();
});

const Register = mongoose.model("Register", loginSchema);
module.exports = Register;
