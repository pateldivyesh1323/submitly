import { createClient } from "redis";
import environments from "../environments";

let redisClient: any;

(async () => {
  try {
    redisClient = createClient({
      url: environments.REDIS_URI,
      password: environments.REDIS_PASSWORD,
    });

    redisClient.on("error", (err: any) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.warn("❌ Redis not found, running without caching.");
    redisClient = null;
  }
})();

export default redisClient;
