const fs = require('fs').promises;
const { nanoid } = require('nanoid');
const path = require("path");
const { isModuleNamespaceObject } = require('util/types');

const contactsPath = path.join(__dirname, "/db/contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}


async function getContactById(contactId) {
    const contacts = await listContacts();
    const res = contacts.find(contact => contact.id === contactId);
    return res || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [res] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return res;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

async function updateContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}