import express, {Express, Request, Response} from "express";
import path from "path";
import fetch from "node-fetch";

const config = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_CLIENT_SECRET,
    client_secret: process.env.REACT_APP_REDIRECT_URI,
    proxy_url: process.env.REACT_APP_PROXY_URL
};

export class Server {
    private app: Express;

    constructor(app: Express) {
        this.app = app;
        this.app.use(express.static(path.resolve("./") + "/build/ui"));

        this.app.get("/api", (req: Request, res: Response): void => {
            res.send("You have reached the API!");
        });

        // Enabled Access-Control-Allow-Origin", "*" in the header to by-pass the CORS error.
        app.use((req: Request, res: Response, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });

        app.post("/authenticate", async (req: Request, res: Response,) => {
            const {code} = req.body;
            // Request to exchange code for an access token
            fetch(`https://github.com/login/oauth/access_token`, {
                method: "POST",
                body: {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    code: code,
                    redirect_uri: config.redirect_uri
                },
            })
                .then((response) => response.text())
                .then((paramsString) => {
                    let params = new URLSearchParams(paramsString);
                    const access_token = params.get("access_token");
                    // Request to return data of a user that has been authenticated
                    return fetch(`https://api.github.com/user`, {
                        headers: {
                            Authorization: `token ${access_token}`,
                        },
                    });
                })
                .then((response) => response.json())
                .then((response) => {
                    return res.status(200).json(response);
                })
                .catch((error) => {
                    return res.status(400).json(error);
                });
        });
        this.app.get("*", (req: Request, res: Response): void => {
            res.sendFile(path.resolve("./") + "/build/ui/index.html");
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
}