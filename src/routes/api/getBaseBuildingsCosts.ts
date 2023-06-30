import { Router, Request, Response } from "express";

const router = Router();
const path = "/api/getBaseBuildingsCosts";

router.get(`${path}`, async (req: Request, res: Response) => {
    return res.status(200).json({ code: 200, message: "OK", costs: {
        coal_mine: {
            coal: 0,
            copper: 1000,
            gold: 500,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        copper_mine: {
            coal: 0,
            copper: 0,
            gold: 500,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        gold_mine: {
            coal: 0,
            copper: 1000,
            gold: 0,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        iron_mine: {
            coal: 0,
            copper: 1000,
            gold: 500,
            iron: 0,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        oil_pump: {
            coal: 0,
            copper: 1000,
            gold: 500,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        uranium_mine: {
            coal: 0,
            copper: 1000,
            gold: 500,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 100
        },
        lumber: {
            coal: 0,
            copper: 1000,
            gold: 500,
            iron: 1000,
            oil: 0,
            uranium: 0,
            wood: 0
        }
    }});
});

export default {
    path,
    router
};