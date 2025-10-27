import Redis from "ioredis";

let redisClient: Redis | null = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,
    });

    redisClient.on("connect", () => console.log("Connected to Redis"));
    redisClient.on("error", (err) => console.error("Redis error", err));
  }
  return redisClient;
}
