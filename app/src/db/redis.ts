import * as redis from 'redis'
import config from "../util/constants";

// create redis client
export const client = redis.createClient({
    url: 'redis://' + config.redis_username + ':' + config.redis_password + '@' + config.redis_host + ':' + parseInt(<string>config.redis_port),
});

// redis connect call
client.connect().then();
client.on("error", (error) => {
    console.error(`❗️ Redis Error: ${error}`)
})
client.on("ready", () => {
    console.log('✅ redis have ready !')
})
client.on("connect", () => {
    console.log('✅ connect redis success !')
})