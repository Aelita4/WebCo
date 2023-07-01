import db from "./index.js";
import User from "./types/database/User";

export default async function(user: User) {
    setInterval(async () => {
        const resources = ((await db.db.query(`SELECT * FROM resources WHERE owner='${user.id}'`))[0].result as Array<any>)[0];
        const buildings = ((await db.db.query(`SELECT * FROM buildings WHERE owner='${user.id}'`))[0].result as Array<any>)[0];

        const resourcesToUpdate = {
            wood: resources.wood + ((2 ** (buildings.lumber ?? 0)) * 1),
            iron: resources.iron + ((2 ** (buildings.ironMine ?? 0)) * 2),
            copper: resources.copper + ((2 ** (buildings.copperMine ?? 0)) * 3),
            gold: resources.gold + ((2 ** (buildings.goldMine ?? 0)) * 4),
            coal: resources.coal + ((2 ** (buildings.coalMine ?? 0)) * 5),
            oil: resources.oil + ((2 ** (buildings.oilMine ?? 0)) * 6),
            uranium: resources.uranium + ((2 ** (buildings.uraniumMine ?? 0)) * 7),
            updatedAt: Date.now()
        }

        await db.db.merge(resources.id, resourcesToUpdate);
    }, 1_000);
}