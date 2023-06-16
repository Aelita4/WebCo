import Surreal from "surrealdb.js";
import logger from "./logger.js";

export default class Database {
    public db: Surreal;

    constructor() {
        logger("DB", "Login", "Connecting to the database...")
        this.db = new Surreal(`http://webco_db:8000/rpc`);

        this.login();
    }

    public async login() {
        await this.db.signin({
            user: 'aelita',
            pass: 'root'
        });
    
        await this.db.use({ ns: 'dev', db: 'webcolony' });

        logger("DB", "Login", "Logged in");
    }

    public async query(sql: string) {
        logger("DB", "Query", sql);
        return this.db.query(sql);
    }

    public async select(sql: string) {
        logger("DB", "Get", sql);
        const returnArray = await this.db.query(`SELECT * FROM ${sql}`);
        const result = (returnArray[0].result as Array<any>)[0];
        return result;
    }

    public async create(thing: string, data: any) {
        logger("DB", "Create", thing);
        return this.db.create(thing, { createdAt: new Date(), updatedAt: new Date(), ...data });
    }

    public async get(table: string, id?: string) {
        logger("DB", "Get", `${table} ${id ? id : ""}`);
        return this.db.select(`${table}${id ? `:${id}` : ""}`);
    }

    public async merge(table: string, data: any) {
        logger("DB", "Merge", table);
        return this.db.merge(table, { updatedAt: new Date(), ...data });
    }

    public async selectWhere(table: string, where: string) {
        logger("DB", "Get", `${table} WHERE ${where}`);
        return ((await this.db.query(`SELECT * FROM ${table} WHERE ${where}`))[0].result as Array<any>)[0];
    }
}