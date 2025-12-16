import * as users from "./data.json" with {type: "json"};
import removeDuplicates, {normalizedEmail, getDomainsFromEmail, getActiveUsers} from './utils.js';
import {User} from './user.js';

// Feature 1
// Removing Duplicates
let importedUsers: User[] = users.default as User[];
const cleanedUsers = removeDuplicates(importedUsers);
console.log("The Json without duplicates : ", cleanedUsers);

// Feature 2 
// Normalize Email
const normalizedEmails: string[] = normalizedEmail(importedUsers);
console.log("Normalised Emails are : ", normalizedEmails);

// Feature 3
// Getting Domains from Email
const domainsList: string[] = getDomainsFromEmail(normalizedEmails);
console.log("The Domains are : ", domainsList);

// Feature 4
// Active Users
const activeUsers: User[] = getActiveUsers(cleanedUsers);
console.log("Active users are : ", activeUsers);

export {}