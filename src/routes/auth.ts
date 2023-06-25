import { Router, Request, Response } from "express";
import db from "../index.js";
import User from "../types/User.js";
import { createHmac } from 'crypto';

const router = Router();
const path = "/auth";

router.post(`${path}/metamask/verify/:address`, async (req: Request, res: Response) => {
    const address = req.params.address;
    const findAddr: User = await db.selectWhere('users', `address = '${address}'`);
    const userFound = typeof findAddr !== 'undefined';

    if(userFound) {
        req.session['user'] = findAddr.username;
        req.session['userId'] = findAddr.id;
        req.session['accessToken'] = findAddr.tmp;
    }

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

    const accessToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    const user: User = (await db.create(`users`, {
        username,
        email,
        address,
        isMetamask: true,
        lastSeen: new Date().getTime(),
        accessToken: createHmac('sha256', accessToken).digest('hex'),
        tmp: accessToken
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

    const planetCount = (await db.get("planets")).length;

    await db.create(`planets`, {
        owner: user.id,
        name: 'Default Planet',
        position: planetCount + 1,
    });

    req.session['user'] = username;
    req.session['userId'] = user.id;
    req.session['accessToken'] = accessToken;
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