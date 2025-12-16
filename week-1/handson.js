import * as users from "./data.json" with { type: "json" };
import removeDuplicates, { normalizedEmail, getDomainsFromEmail, getActiveUsers } from './utils.js';
// Feature 1
// Removing Duplicates
let importedUsers = users.default;
const cleanedUsers = removeDuplicates(importedUsers);
console.log("The Json without duplicates : ", cleanedUsers);
// Feature 2 
// Normalize Email
const normalizedEmails = normalizedEmail(importedUsers);
console.log("Normalised Emails are : ", normalizedEmails);
// Feature 3
// Getting Domains from Email
const domainsList = getDomainsFromEmail(normalizedEmails);
console.log("The Domains are : ", domainsList);
// Feature 4
// Active Users
const activeUsers = getActiveUsers(cleanedUsers);
console.log("Active users are : ", activeUsers);
