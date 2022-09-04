import Cryptr from "cryptr";

const CRYPTR_KEY: string = process.env.CRYPTR_KEY || "valex";
const cryptr = new Cryptr(CRYPTR_KEY);


export function encryptSecurityCode(securityCode: string) { console.log(securityCode);
    return cryptr.encrypt(securityCode);
}

export function decryptSecurityCode(dbSecurityCode: string) {
    return cryptr.decrypt(dbSecurityCode);
}