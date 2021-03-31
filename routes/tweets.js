const express = require("express");
const router = express.Router();
const db = require('../db/models');
const { Tweet } = db;

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

router.get("/", asyncHandler( async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
}));

module.exports = router;