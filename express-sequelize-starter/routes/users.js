const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const { asyncHandler, handleValidationErrors } = require("../utils");
const db = require("../db/models");
const { User } = db;
const { getUserToken } = require('../auth.js');


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

router.post("/", validateUsername, validateEmailAndPassword, handleValidationErrors, asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, hashedPassword, username })

    const token = getUserToken(user);
    res.status(201).json({
        user: { id: user.id },
        token,
    });
})
);

module.exports = router;