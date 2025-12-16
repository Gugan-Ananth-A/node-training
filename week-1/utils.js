export default function removeDuplicates(users) {
    const uniqueUser = users.reduce((accumulator, user) => {
        accumulator[user.email.toLocaleLowerCase().replaceAll(' ', '')] = user;
        return accumulator;
    }, {});
    return Object.values(uniqueUser);
}
export function normalizedEmail(users) {
    const normalizedEmails = users.map((user) => {
        return user.email.toLocaleLowerCase().trim();
    });
    const set = new Set(normalizedEmails);
    return Array.from(set);
}
export function getDomainsFromEmail(emails) {
    const domains = emails.map((email) => {
        return email.split("@")[1].split(".")[0];
    });
    const set = new Set(domains);
    return Array.from(set);
}
export function getActiveUsers(users) {
    return users.filter((user) => user.active === true);
}
