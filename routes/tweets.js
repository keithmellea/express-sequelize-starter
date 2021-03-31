const express = require("express");
const router = express.Router();
const db = require('../db/models');
const { Tweet } = db;

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

// GET /tweets
router.get("/", asyncHandler( async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
}));

const tweetNotFoundError = (id) => {
    const error = Error(`Tweet with id of ${id} could not be found`);
    error.title = "Tweet not found";
    error.status = 404;
    return error;
};

// GET /tweets/2
router.get("/:id(\\d+)", asyncHandler( async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(parseInt(tweetId));
    if (!tweet) {
        next(tweetNotFoundError(tweetId));
    } else {
        res.json({ tweet })
    };
}));



module.exports = router;