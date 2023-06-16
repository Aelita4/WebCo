import express, { Request, Response, NextFunction } from 'express';
import { readdirSync, lstatSync } from 'fs';
import path from 'path';
import url from 'url';
import logger from './logger.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.set('views', __dirname + "../views");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "../views/public"));

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

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});