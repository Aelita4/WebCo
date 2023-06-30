import DatabaseRecord from "./DatabaseRecord";

export default interface User extends DatabaseRecord {
    username: string;
    email: string;
    password?: string;
    address?: string;
    isMetamask: boolean;
    lastSeen: number;
    accessToken: string;
    tmp: string;
}