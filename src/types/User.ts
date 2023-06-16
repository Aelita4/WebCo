import DatabaseRecord from "./DatabaseRecord";

export default interface User extends DatabaseRecord {
    username: string;
    address: string;
}