const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const { asyncHandler, handleValidationErrors } = require("../utils");

const validateUsername = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a username")   
];

const validateEmailAndPassword = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password")
];

router.post("/", validateUsername, validateEmailAndPassword, handleValidationErrors, asyncHandler(async ( req, res) => {
    const { username, password, email } = req.body;
    const hashedPW = await bcrypt.hash(password, 10);
   
}));

module.exports = router;