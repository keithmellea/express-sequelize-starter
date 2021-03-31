const express = require("express");
const router = express.Router();
const db = require('../db/models');
const { Tweet } = db;
const { check, validationResult } = require('express-validator');

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const validateTweet = [
    check('message')
    .exists({ checkFalsy: true })
    .withMessage('Tweet can\'t be empty')
    .isLength( { max: 280 })
    .withMessage('Tweet can\'t be longer than 280 characters')
];

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {

        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }

    next();
}
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
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
        next(tweetNotFoundError(tweetId));
    } else {
        res.json({ tweet })
    };
}));

// POST /tweets -- creating new tweets
router.post("/", validateTweet, handleValidationErrors, asyncHandler( async (req, res) => {
    const { message } = req.body;
    const newTweet = await Tweet.create( { message });
    res.status(201).json( { newTweet });
}));

// PUT /tweets to update
router.put("/:id(\\d+)", validateTweet, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet) {
        await tweet.update({ message: req.body.message });
        res.json({ tweet });
    } else {
        next(tweetNotFoundError(tweetId))
    }
}));

// DELETE tweet
router.delete("/:id(\\d+)", asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet) {
        await tweet.destroy();
        res.status(204).end();
    } else {
        next(tweetNotFoundError(tweetId));
    }
}));


module.exports = router;