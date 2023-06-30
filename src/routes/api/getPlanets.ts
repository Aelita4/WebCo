import { Router, Request, Response } from "express";
import db from "../../index.js";
import Planet from "../../types/database/Planet.js";
import User from "../../types/database/User.js";

const router = Router();
const path = "/api/getPlanets";

router.get(`${path}`, async (req: Request, res: Response) => {
    const findPlanets = await db.get('planets');
    const users = await db.get<User>('users');

    const planets: Array<any> = [];

    findPlanets.forEach((planet: any) => {
        planet.owner = users.find((user: User) => user.id === planet.owner) || 'unknown';
        planets.push({
            id: planet.id,
            name: planet.name,
            owner: planet.owner,
            position: planet.position,
        })
    });

    res.status(200).json({ code: 200, message: "OK", planets });

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