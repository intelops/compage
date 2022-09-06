"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_CLIENT_SECRET,
    client_secret: process.env.REACT_APP_REDIRECT_URI,
    proxy_url: process.env.REACT_APP_PROXY_URL
};
class Server {
    constructor(app) {
        this.app = app;
        this.app.use(express_1.default.static(path_1.default.resolve("./") + "/build/ui"));
        this.app.get("/api", (req, res) => {
            res.send("You have reached the API!");
        });
        // Enabled Access-Control-Allow-Origin", "*" in the header to by-pass the CORS error.
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });
        app.post("/authenticate", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            // Request to exchange code for an access token
            (0, node_fetch_1.default)(`https://github.com/login/oauth/access_token`, {
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
                return (0, node_fetch_1.default)(`https://api.github.com/user`, {
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
        }));
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.resolve("./") + "/build/ui/index.html");
        });
    }
    start(port) {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
}
exports.Server = Server;
