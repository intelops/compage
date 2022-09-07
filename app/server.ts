import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";
import path from "path";
import {config} from "./constants";
import axios from "axios";

export class Server {
    private app: Express;

    constructor(app: Express) {
        this.app = app;
        this.app.use(express.static(path.resolve("./") + "/build/ui"));

        this.app.get("/api", (req: Request, res: Response): void => {
            res.send("You have reached the API!");
        });

        //TODO remove this later, idea is to fetch the auth details from server
        // this.app.get("/auth_details", (req: Request, res: Response): void => {
        //     res.send({client_id: config.client_id, redirect_uri: config.redirect_uri});
        // });

        // Enabled Access-Control-Allow-Origin", "*" in the header to by-pass the CORS error.
        app.use((req: Request, res: Response, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });

        app.post("/authenticate", async (req: Request, res: Response,) => {
            const {code} = req.body;
            // Request to exchange code for an access token
            axios({
                url: `https://github.com/login/oauth/access_token`, method: "POST", data: {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    code: code,
                    redirect_uri: config.redirect_uri
                }
            }).then(response => {
                let params = new URLSearchParams(response.data);
                const access_token = params.get("access_token");
                // Request to return data of a user that has been authenticated
                return axios(`https://api.github.com/user`, {
                    headers: {
                        Authorization: `token ${access_token}`,
                    },
                }).then((response) => {
                    return res.status(200).json(response.data);
                }).catch((error) => {
                    return res.status(400).json(error);
                });
            }).catch((error) => {
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

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({type: "text/*"}));
app.use(bodyParser.urlencoded({extended: false}));

const PORT = parseInt(process.env.SERVER_PORT) || 5000;
const server = new Server(app);
server.start(PORT);