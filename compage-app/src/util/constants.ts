require("dotenv").config();


export const config = {
    // github config
    client_id: process.env.GITHUB_APP_CLIENT_ID,
    redirect_uri: process.env.GITHUB_APP_REDIRECT_URI,
    client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
    // compage-core url
    compage_core_url: process.env.COMPAGE_CORE_URL,
    // redis config
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT || '',
    redis_password: process.env.REDIS_PASSWORD,
    redis_username: process.env.REDIS_USERNAME
};
