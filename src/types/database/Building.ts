import DatabaseRecord from "./DatabaseRecord";

export default interface Building extends DatabaseRecord {
    owner: string,
    iron_mine: number,
}