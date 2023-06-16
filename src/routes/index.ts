import { Router, Request, Response } from "express";

const router = Router();
const path = "/";

router.get(path, (req: Request, res: Response) => {
    res.render('pages/index.ejs');
});

export default {
    path,
    router
};