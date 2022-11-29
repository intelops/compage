import "dotenv/config";

export const config = {
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT || '',
    redis_password: process.env.REDIS_PASSWORD,
    redis_username: process.env.REDIS_USERNAME
};