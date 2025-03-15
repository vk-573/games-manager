const express = require("express");

const router = express.Router();

const db = require('../models');

const GameService = require("../services/GameService");

// The parameters that are sent are `name` and `platform` and the expected behavior is to return
// results that match the platform and match or partially match the name string. 
// If no search has been specified, then the results should include everything (just like it does now).

async function search(req, res, next) {
    // TODO input validation (platform enums, class validation typescript) + sanitzing for security
    // Not high priority since it is a in-house usage API
    try {
        const { name, platform } = req.body;
        const games = await GameService.search(name, platform)
        return res.status(200).send(games)
    } catch (err) {
        next(err)
    }
    
}

async function getAll(req, res, next) {
    try {
        const games = await GameService.getAll()
        return res.status(200).send(games)
    } catch (err) {
        next(err)
    }
}

async function populate(req, res, next) {
    try {
        const games = await GameService.populate()
        return res.status(200).send(games)
    } catch (err) {
        next(err)
    }
}

async function create(req, res, next) {
    try {
        // TODO put in model class and validation
        const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
        const game = await GameService.create(publisherId, name, platform, storeId, bundleId, appVersion, isPublished)
        return res.status(201).send(game)
    } catch (err) {
        next(err)
    }
}

async function updateGame(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
        const game = await GameService.update(id, publisherId, name, platform, storeId, bundleId, appVersion, isPublished)
        return res.status(200).send()
    } catch (err) {
        next(err)
    }
  };

async function deleteGame(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        await GameService.delete(id)
        return res.status(200).send()
    } catch (err) {
        next(err)
    }
};


router.post("/search", search);
router.get("/", getAll);
router.post("/", create);
router.post("/populate", populate)
router.put("/:id", updateGame)
router.delete("/:id", deleteGame)

module.exports = router 