import DatabaseRecord from "./DatabaseRecord";

export default interface User extends DatabaseRecord {
    username: string;
    email: string;
    password: string;
}