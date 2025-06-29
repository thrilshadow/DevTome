// db.js
export class DevTomeDB {
  constructor(dbName = "DevTomeDB", version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        console.error("❌ Database error:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("✅ Database opened:", this.dbName);
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;

        // Define object stores here
        if (!this.db.objectStoreNames.contains("stories")) {
          const store = this.db.createObjectStore("stories", { keyPath: "id", autoIncrement: true });
          store.createIndex("name", "name", { unique: false });
          console.log("📁 'stories' store created");
        }
      };
    });
  }

  async addStory(story) {
  const cleanStory = {
    tools: [],
    ...story,
  };
  return this.#withStore("stories", "readwrite", (store) => store.add(cleanStory));
}
  
  async updateStory(story) {
  return this.#withStore("stories", "readwrite", (store) => store.put(story));
}


  async getAllStories() {
    return this.#withStore("stories", "readonly", (store) => store.getAll());
  }
  
async getStory(name) {
  return this.#withStore("stories", "readonly", (store) => {
    const index = store.index("name");
    return index.get(name);
  });
}
  async deleteStory(id) {
    return this.#withStore("stories", "readwrite", (store) => store.delete(id));
  }

  #withStore(storeName, mode, callback) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = callback(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}