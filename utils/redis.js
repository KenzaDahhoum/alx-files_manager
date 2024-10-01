import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.error('Redis client not connected to the server:', err));
    this.client.on('connect', () => console.log('Redis client connected to the server'));
    this.client.connect();
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, time) {
    await this.client.set(key, value);
    if (time) {
      await this.client.expire(key, time);
    }
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
