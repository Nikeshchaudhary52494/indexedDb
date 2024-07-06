// src/utils/indexedDB.ts

const DB_NAME = "chatDatabase";
const DB_VERSION = 1;
const STORE_NAME = "messages";

export interface Message {
    id?: number; // Make id optional
    content: string;
    timestamp: number;
}

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Database error:", event);
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };
    });
};

export const addMessage = async (message: Omit<Message, "id">): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.add(message);
};

export const getAllMessages = async (): Promise<Message[]> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result);
        };

        request.onerror = (event) => {
            console.error("Get all messages error:", event);
            reject("Error getting all messages");
        };
    });
};

export const deleteMessage = async (id: number): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
};

export const updateMessage = async (message: Message): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(message);
};
