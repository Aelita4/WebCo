import express, { Request, Response, NextFunction } from 'express';
import { readdirSync, lstatSync } from 'fs';
import path from 'path';
import url from 'url';
import logger from './logger.js';
import Database from './database.js';
import session from 'express-session';
import config from './config.js';
import resourceRefresh from './resourceRefresh.js';
import { setTimeout } from 'timers/promises';
import User from './types/database/User.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const db = new Database();

app.set('views', __dirname + "../views");
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "../views/public"));
app.use(session({
  name: 'webcolony',
  secret: 'KapitanBomba',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,
      maxAge: 1_440_000
  }
}));

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    logger("WEB", "Request", `${req.method} ${req.path} ${req.ip}`);
    next();
});

const routesDir = path.join(__dirname, 'routes');

function readRoutesDir(dir: string) {
  readdirSync(dir).forEach(async file => {
    const filePath = path.join(dir, file);
    if (lstatSync(filePath).isDirectory()) {
        readRoutesDir(filePath);
    } else {
        const router = await import(filePath);
        logger("WEB", "Route", `Loaded route ${router.default.path}`);
        app.use("/", router.default.router);
    }
  });
}

readRoutesDir(routesDir);

app.listen(config.port, async () => {
  	logger("WEB", "Server", `Listening on port ${config.port}`);

    await setTimeout(1000);

    const users = await db.get<User>("users");

    users.forEach(async (user: User) => {
        resourceRefresh(user);
    });
});

declare module "express-session" {
	interface SessionData {
		user: string;
    userId: string;
		isMetamask: boolean;
		token: string;
    accessToken: string;
	}
}

export default db;