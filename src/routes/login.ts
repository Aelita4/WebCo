import { Router, Request, Response } from "express";

const router = Router();
const path = "/login";

router.get(path, (req: Request, res: Response) => {
    res.send('Hello Login!');
});

export default {
    path,
    router
};