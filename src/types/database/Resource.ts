import DatabaseRecord from "./DatabaseRecord";

export default interface Resource extends DatabaseRecord {
    owner: string,
    wood: number,
    iron: number,
    copper: number,
    gold: number,
    coal: number,
    oil: number,
    uranium: number,
}