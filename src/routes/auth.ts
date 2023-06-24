import { Router, Request, Response } from "express";
import db from "../index.js";
import User from "../types/User.js";

const router = Router();
const path = "/auth";

router.post(`${path}/metamask/verify/:address`, async (req: Request, res: Response) => {
    const address = req.params.address;
    const findAddr = await db.selectWhere('users', `address = '${address}'`);
    const userFound = typeof findAddr !== 'undefined';

    res.status(200).json({ code: 200, message: "OK", userFound });
});

router.post(`${path}/metamask/create`, async (req: Request, res: Response) => {
    const username: string = req.body['login'];
    const email = req.body['email'];
    const address = req.body['address'];

    if(username.length < 3 || username.length > 16) {
        res.redirect(`/metamaskRegister?address=${address}&form=register&error=usernameLength`);
        return;
    }

    if(username.match(/[^a-zA-Z0-9_]/g)) {
        res.redirect(`/metamaskRegister?address=${address}&form=register&error=usernameInvalid`);
        return;
    }

    if(!validateEmail(email)) {
        res.redirect(`/metamaskRegister?address=${address}&form=register&error=emailInvalid`);
        return;
    }

    const ifFound = await db.selectWhere('users', `username = '${username}' OR email = '${email}'`);
    if(typeof ifFound !== 'undefined') {
        if(ifFound.username === username) res.redirect(`/metamaskRegister?address=${address}&form=register&error=usernameTaken`);
        else if(ifFound.email === email) res.redirect(`/metamaskRegister?address=${address}&form=register&error=emailTaken`);
        return;
    }

    const user: User = (await db.create(`users`, {
        username,
        email,
        address,
        isMetamask: true
    }))[0];

    await db.create(`resources`, {
        owner: user.id,
        wood: 0,
        iron: 0,
        copper: 0,
        gold: 0,
        coal: 0,
        oil: 0,
        uranium: 0,
    });

    await db.create(`buildings`, {
        owner: user.id,
        iron_mine: 0,
    });

    await db.create(`planets`, {
        owner: user.id,
        name: 'Default Planet'
    });

    req.session['user'] = username;
    req.session['userId'] = user.id;
    res.redirect('/game');
});

router.get(`${path}/logout`, async (req: Request, res: Response) => {
    const redirectTo = req.query.redirectTo as string || '/';
    req.session.destroy(() => {});
    res.redirect(redirectTo);
});

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // DEAR GOD
    return re.test(email);
}

export default {
    path,
    router
};