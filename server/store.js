/**
 * Simple JSON file-based storage — replaces MongoDB
 * Data persists in server/data/*.json files
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf-8');
        return [];
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeCollection(collection, data) {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Generate a simple unique ID
function generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

const store = {
    /**
     * Find all documents matching a filter function
     */
    find(collection, filterFn = () => true) {
        const data = readCollection(collection);
        return data.filter(filterFn);
    },

    /**
     * Find one document matching a filter function
     */
    findOne(collection, filterFn) {
        const data = readCollection(collection);
        return data.find(filterFn) || null;
    },

    /**
     * Find by ID
     */
    findById(collection, id) {
        return this.findOne(collection, (item) => item._id === id);
    },

    /**
     * Insert a new document
     */
    insert(collection, doc) {
        const data = readCollection(collection);
        const newDoc = { _id: generateId(), ...doc, createdAt: doc.createdAt || new Date().toISOString() };
        data.push(newDoc);
        writeCollection(collection, data);
        return newDoc;
    },

    /**
     * Update a document by ID
     */
    updateById(collection, id, updates) {
        const data = readCollection(collection);
        const index = data.findIndex((item) => item._id === id);
        if (index === -1) return null;
        data[index] = { ...data[index], ...updates };
        writeCollection(collection, data);
        return data[index];
    },

    /**
     * Delete all documents in a collection
     */
    deleteAll(collection) {
        writeCollection(collection, []);
    },

    /**
     * Count documents
     */
    count(collection, filterFn = () => true) {
        return this.find(collection, filterFn).length;
    }
};

module.exports = { store, generateId };
