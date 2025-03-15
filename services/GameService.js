const GameRepository = require("../repository/GameRepository")

const { AppError } = require("../errorHandler")
const { isDefined } = require("../utils/isDefined")

class GameService {
    async search(name, platform) {
        console.log("searching")
        return await GameRepository.searchByNameAndPlatform(name, platform)
    }
    
    async getAll() {
        const games = await GameRepository.findAll()
        return games
    }

    // taking 100 games sorted by "rating" from ios and android json files (200 total)
    async populate() {
        console.log("populating");
        // IOS
        const iosGames = await GameRepository.getIosGamesJson()
        //console.log("iso games:", iosGames);
        const sortedIosGames = await this.sortGames(iosGames)
        console.log("sortedIosGames:", sortedIosGames);
        // ANDROID
        const androidGames = await GameRepository.getAndroidGamesJson()
        const sortedAndroidGames = await this.sortGames(androidGames)
        const concatenatedGames = sortedAndroidGames.concat(sortedIosGames)
        
        await GameRepository.upsertBulk(concatenatedGames)
    }

    async create(publisherId, name, platform, storeId, bundleId, appVersion, isPublished) {
        return await GameRepository.create(publisherId, name, platform, storeId, bundleId, appVersion, isPublished)
    }

    async update(id, publisherId, name, platform, storeId, bundleId, appVersion, isPublished) {
        const game = await GameRepository.findOne(id)
        if (!isDefined(game)) {
            throw new AppError(404, "Could not find the game")
        }
        return await GameRepository.update(id, publisherId, name, platform, storeId, bundleId, appVersion, isPublished)
      };
      
    async delete(id) {
        const game = await GameRepository.findOne(id)
        if (!isDefined(game)) {
            throw new AppError(404, "Could not find the game")
        }
        return await GameRepository.delete(id)
    };


    // PRIVATE methods (TODO apply security with typescript)
    
    async sortGames(json) {
        try {
            let res = json.sort((a, b) => b.rating - a.rating).slice(0, 100)
            return res;
        } catch (err) {
            throw new AppError(500, err.message, "Error while parsing the game json file")
        }
    }
}

module.exports = new GameService();
