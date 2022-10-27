import "dotenv/config";

export const config = {
    client_id: process.env.GITHUB_APP_CLIENT_ID,
    redirect_uri: process.env.GITHUB_APP_REDIRECT_URI,
    client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
    compage_core_url: process.env.COMPAGE_CORE_URL,
};
