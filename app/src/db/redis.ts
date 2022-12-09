import * as redis from 'redis'
import config from "../util/constants";

// create redis client
const client = redis.createClient({
    url: 'redis://' + config.redis_username + ':' + config.redis_password + '@' + config.redis_host + ':' + parseInt(<string>config.redis_port),
});

// redis connect call
client.connect().then();
client.on("error", (error) => console.error(`Error : ${error}`));

export const get = async (key: string) => {
    return await client.get(key);
}


export const set = async (key: string, value: string) => {
    return await client.set(key, value);
}