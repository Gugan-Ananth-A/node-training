import { User } from "./user.js";

export default function removeDuplicates (users: User[]): User[] {
    const uniqueUser = users.reduce<Record<string, User>>((accumulator, user) => {
        accumulator[user.email.toLocaleLowerCase().replaceAll(' ', '')] = user;
        return accumulator;
    }, {});
    return Object.values(uniqueUser);
}

export function normalizedEmail (users: User[]): string[] {
    const normalizedEmails: string[] = users.map<string>((user: User) => {
        return user.email.toLocaleLowerCase().trim();
    }); 
    const set = new Set<string>(normalizedEmails);
    return Array.from(set);
}

export function getDomainsFromEmail (emails: string[]): string[] {
    const domains: string[] = emails.map<string>((email: string) => {
        return email.split("@")[1].split(".")[0];
    })
    const set = new Set<string>(domains);
    return Array.from(set);
}

export function getActiveUsers(users: User[]): User[] {
    return users.filter((user) => user.active === true);
}