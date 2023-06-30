import DatabaseRecord from "./DatabaseRecord";

export default interface Planet extends DatabaseRecord {
    owner: string,
    name: string,
    position: number,
}