import * as redis from 'redis'
import {config} from "./constants";

// create redis client
export const client = redis.createClient({
    url: 'redis://' + config.redis_username + ':' + config.redis_password + '@' + config.redis_host + ':' + parseInt(config.redis_port),
});