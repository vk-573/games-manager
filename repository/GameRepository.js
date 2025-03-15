const db = require('../models');
const { Op } = require("sequelize");

const { AppError } = require("../errorHandler")
const { isDefined } = require("../utils/isDefined")

// We can add a nother layer of abtraction for the sequelize "db"
class GameRepository {
    async searchByNameAndPlatform(name, platform) {
        let whereClause = {};
        // in the scenario where name and platform has been sanitezed at the controller level
        if (isDefined(name)) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }
        if (isDefined(platform)) {
            whereClause.platform = platform;
        }
        const games = await db.Game.findAll({ where: whereClause });
        return games
    }
    
    async findAll() {
        return await db.Game.findAll()
    }

    

    async upsertBulk(games) {
        try {
            // UPSERT BEHAVIOUR instead of INSERT
            // SQLlite does not support the updateOnDuplicate option of sequelize
            // 1) We can loop for each game in order mock the upsert behaviour by reading and only then updating
            // It will be a lot less performant and resourcefull than a native upsert command
            const res = await Promise.all(games.map(game => this.upsertGame(game)));

            // 2) We can use .query of sequelize in order to implement a raw sql query
            // for example using INSERT OR REPLACE sql command
            // but we are not using the orm as asked.

            // Im not sure whether you wanted me to manage this edge case at all or not,
            // so I will leave as well  my first naive solution which is using the orm with the insert behaviour
            //await db.Game.bulkCreate(games, {
            //        fields: ["publisherId", "name", "platform","storeId","bundleId","appVersion","isPublished"],
            //    }
            //)
        } catch(err) {
            throw new AppError(500, err.message, "Error while upserting top ios and android games")
        }
    }

    async findOne(id) {
        try {
            return await db.Game.findByPk(id)
        } catch (err) {
            throw new AppError(500, err.message, `Error while getting ${id} game`)
        }
    }

    async delete(id) {
        try {
            return await db.Game.destroy({where: { id }})
        } catch (err) {
            throw new AppError(500, err.message, `Error while deleting ${id} game`)
        }
    }

    async create(publisherId, name, platform, storeId, bundleId, appVersion, isPublished) {
        try {
            return await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
        } catch (err) {
            throw new AppError(500, err.message, `Error while creating ${id} game`)
        }
    }

    async update(id, publisherId, name, platform, storeId, bundleId, appVersion, isPublished) {
        try {
            return await db.Game.update({publisherId, name, platform, storeId, bundleId, appVersion, isPublished}, { where: { id }})
        } catch (err) {
            throw new AppError(500, err.message, `Error while updating ${id} game`)
        }
    }

    async upsertGame(gameData) {
        try {
            let whereClause = {
                publisherId: gameData.publisherId,
                platform: gameData.platform,
                storeId: gameData.storeId
            };
            const game = await db.Game.findOne({where: whereClause});
            if (game) {
                await db.Game.update(gameData, {where: whereClause});
            } else {
                await db.Game.create(gameData);
            }
      
        } catch (err) {
            console.log(`Game with id ${gameData.storeId} couldn't be upserted, ERROR:`, err);
            throw err
        }
      }

    // separating these fetcher into the GameRepository methods
    // because GameService must not know these urls
    async getIosGamesJson() {
        try {
            const res = await fetch("https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json")
            const json = await this.parseIntoGames(res)
            return json;
        } catch (err) {
            // TODO add specific class error by error type
            // so that each class error can carry naturally
            // its own status code, thus removing status codes
            // from business logic
            throw new AppError(500, err.message, "Error while fetching the ios games json")
        }
    }

    async getAndroidGamesJson() {
        try {
            const res = await fetch("https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json")
            const json = await this.parseIntoGames(res)
            return json;
        } catch (err) {
            throw new AppError(500, err.message, "Error while fetching the android games json")
        }
    }

    // PRIVATES methods
    async parseIntoGames(rawJson) {
        const json = await rawJson.json()
        // flatting because 100 arrays each containing 3 objects
        let jsonFlatted = json.flat();
        const map = jsonFlatted.map(elem => {
            if (isDefined(elem.publisher_id), isDefined(elem.platform), isDefined(elem.id)) {
                return {
                    publisherId: elem.publisher_id,
                    name: elem.name,
                    platform: elem.os,
                    // not sure about the storeId
                    storeId: elem.id,
                    bundleId: elem.bundle_id,
                    appVersion: elem.version,
                    isPublished: 1, // always true
                    rating: elem.rating,
                }
            }
        });
        return map
    }

}

module.exports = new GameRepository();