import { hashSync, compareSync } from "bcrypt";

export function hashPassword(password: string) {
    const SALT: number = Number(process.env.BCRYPT_SALT);

    return hashSync(password, SALT);
}

export function comparePasswords(dbPassword: string , password: string) {
    return compareSync(password, dbPassword);
}