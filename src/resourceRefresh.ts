import db from "./index.js";
import User from "./types/User";

export default async function(user: User) {
    setInterval(async () => {
        const resources = ((await db.db.query(`SELECT * FROM resources WHERE owner='${user.id}'`))[0].result as Array<any>)[0];
        // const buildings = ((await db.db.query(`SELECT * FROM buildings WHERE owner='${user.id}'`))[0].result as Array<any>)[0];

        const resourcesToUpdate = {
            wood: resources.wood + 1,
            iron: resources.iron + 2,
            copper: resources.copper + 3,
            gold: resources.gold + 4,
            coal: resources.coal + 5,
            oil: resources.oil + 6,
            uranium: resources.uranium + 7,
        }

        await db.db.merge(resources.id, resourcesToUpdate);
    }, 1_000);
}