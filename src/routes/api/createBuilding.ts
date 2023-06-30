import { Router, Request, Response } from "express";
import db from "../../index.js";
import { createHmac } from 'crypto';
import fetch from "node-fetch";
import User from "../../types/database/User.js";
import Building from "../../types/database/Building.js";

const router = Router();
const path = "/api/createBuilding";

router.post(`${path}/:userId/:name/:toLevel`, async (req: Request, res: Response) => {
    const url = req.protocol + '://' + req.get('host');

    const accessToken = req.headers['authorization'];
    // if(typeof accessToken === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const findUser = (await db.get<User>(req.params["userId"]))[0];
    // const findUser: User = await db.selectWhere('users', `accessToken = '${createHmac('sha256', accessToken).digest('hex')}'`);
    // if(typeof findUser === 'undefined') return res.status(401).json({ code: 401, message: "Unauthorized" });

    const building = req.params['name'];
    const findBuilding: Building = await db.selectWhere('buildings', `owner = ${findUser.id}`);

    const toLevel = parseInt(req.params["toLevel"]);
    
    const resources = (await (await fetch(`${url}/api/getResources/${findUser.id}`, { headers: { "Authorization": "spy" } })).json() as any);
    const costs = (await (await fetch(`${url}/api/getBaseBuildingsCosts`)).json() as any).costs[building];
    for(const resource in costs) {
        if(resources.resources[resource] < costs[resource]) return res.status(400).json({ code: 400, message: "Bad request" });
    }

    await db.merge(resources.id, {
        wood: resources.resources.wood - costs.wood,
        iron: resources.resources.iron - costs.iron,
        copper: resources.resources.copper - costs.copper,
        gold: resources.resources.gold - costs.gold,
        coal: resources.resources.coal - costs.coal,
        oil: resources.resources.oil - costs.oil,
        uranium: resources.resources.uranium - costs.uranium,
    })

    // const data: any = {};
    // data[building] = (findBuilding[building as keyof(Building)] as number) + 1;

    await db.merge(findBuilding.id, {
        [building]: toLevel
    });

    res.status(200).json({ code: 200, message: "OK" });
    
    // const findBuildings = await db.selectWhere('buildings', `owner = '${req.params['id']}'`);
    // if(typeof findBuildings !== 'undefined') {
    //     delete findBuildings.createdAt;
    //     delete findBuildings.updatedAt;
    //     delete findBuildings.owner;
    //     delete findBuildings.id;
    //     res.status(200).json({ code: 200, message: "OK", buildings: findBuildings });
    // } else {
    //     res.status(404).json({ code: 404, message: "Not found" });
    // }
});

export default {
    path,
    router
};