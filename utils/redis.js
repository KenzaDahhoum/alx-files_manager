const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Display any errors from the client
    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err}`);
    });

    // Promisify the client's get, set, and del methods to use async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Check if Redis client is alive
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get value from Redis by key
   * @param {string} key
   * @returns {Promise<string | null>} Value stored in Redis or null if not found
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Set a key-value pair in Redis with an expiration time
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   */
  async set(key, value, duration) {
    await this.setAsync(key, value);
    this.client.expire(key, duration);
  }

  /**
   * Delete a value from Redis by key
   * @param {string} key - The key to delete
   */
  async del(key) {
    await this.delAsync(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;

