import redisClient from "../lib/redisClient";

export const setCache = async (key: string, value: any, ttl: number) => {
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
      console.error(`Failed to set cache for key ${key}:`, error);
    }
  } else {
    console.warn("Redis is not connected. Skipping cache set.");
  }
};

export const getCache = async (key: string) => {
  if (redisClient) {
    try {
      const cachedValue = await redisClient.get(key);
      return cachedValue ? JSON.parse(cachedValue) : null;
    } catch (error) {
      console.error(`Failed to get cache for key ${key}:`, error);
    }
  } else {
    console.warn("Redis is not connected. Skipping cache get.");
  }
  return null;
};
