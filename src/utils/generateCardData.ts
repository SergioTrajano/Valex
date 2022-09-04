import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { PaymentWithBusinessName } from "../repositories/paymentRepository";
import { Recharge } from "../repositories/rechargeRepository";

export function generateCardNumber() {
    return faker.finance.creditCardNumber();
}

export function formatCardHolderName(fullName: string) {
    let formatName: string = "";

    fullName.split(" ").forEach((name: string, i) => {
        if (i === 0 || i === fullName.split(" ").length - 1) formatName += `${name[0].toUpperCase()}${name.slice(1).toLowerCase()} `;
        else if (name.length > 2) formatName += `${name[0].toUpperCase()} `
    });

    return formatName.trim();
}

export function generateExpirationDate() {
    return dayjs().add(5, "year").format("MM/YY");
}

export function generateSecurityCode() {
    return faker.finance.creditCardCVV();
}

export function generateBalance(recharges: Recharge[], pucharses: PaymentWithBusinessName[]) {
    const cardRecharges: number = recharges.reduce((total: number, curr: { amount: number}) => total += curr.amount, 0);
    const cardTransactions:number = pucharses.reduce((total: number, curr: {amount: number}) => total += curr.amount, 0);

    return cardRecharges - cardTransactions;
}