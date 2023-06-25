import { Router, Request, Response } from "express";

const router = Router();
const path = "/api/getDefaultMiningRates";

router.get(`${path}`, async (req: Request, res: Response) => {
    return res.status(200).json({ code: 200, message: "OK", rates: {
        wood: 1,
        iron: 2,
        copper: 3,
        gold: 4,
        coal: 5,
        oil: 6,
        uranium: 7,
    }});
});

export default {
    path,
    router
};