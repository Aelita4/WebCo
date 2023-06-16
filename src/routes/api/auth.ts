import { Router, Request, Response } from "express";

const router = Router();
const path = "/api/auth";

router.get(path, (req: Request, res: Response) => {
    res.send('Hello Auth!');
});

export default {
    path,
    router
};