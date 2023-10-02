# app
- This is a component which connects to different git-platforms and push-pull repositories. 
- This also uses Cassandra or SQLite (based on configuration) databases to persist projects, gitplatforms and users related details.
- It's an Express.js based REST server and gRPC client to core component.

#### How to run this component?
- Navigate to app directory [`cd app`] from root directory of compage
- Fire `npm install` to install the dependencies
- Run `npm run dev` command to start the express-server. This command will auto-reload the changes you make to app directory.
- Kill process on port 5000
```sudo kill -9 `sudo lsof -t -i:5000```
