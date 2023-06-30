import DatabaseRecord from "./DatabaseRecord";

export default interface Building extends DatabaseRecord {
    owner: string,
    coal_mine: number,
    copper_mine: number,
    gold_mine: number,
    iron_mine: number,
    oil_pump: number,
    uranium_mine: number,
    lumber: number,
}