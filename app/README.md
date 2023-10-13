# app

- This is a component that connects to different git-platforms and push-pull repositories.
- This also uses Cassandra or SQLite (based on configuration) databases to persist projects, git platforms, and users
  related details.
- It's an Express.js based REST server and gRPC client to a core component.
- The sqlite is used as a database for development. To use cassandra, you need to set the following environment
  variables in your terminal along with a `export DB_TYPE='cassandra'`.

#### Use cassandra as a database

```bash
export DB_TYPE='cassandra';
export CASSANDRA_CONTACT_POINTS = 'localhost';
export CASSANDRA_LOCAL_DATA_CENTER = 'datacenter1';
export CASSANDRA_KEYSPACE = 'compage';
export CASSANDRA_USERNAME = 'cassandra';
export CASSANDRA_PASSWORD = 'cassandra';
```

- To start the cassandra server on local, you can fire command `docker-compose up -d` from the setup directory of
  compage/app.

#### Use SQLite as a database

```shell
export DB_TYPE='sqlite'
```

#### How to run this component?

- Navigate to app directory [`cd app`] from root directory of compage
- Fire `npm install` to install the dependencies
- Run `npm run dev` command to start the express-server. This command will auto-reload the changes you make to app
  directory.
- If something goes wrong, you want to kill the process on port 5000, run the following command
  ```sudo kill -9 `sudo lsof -t -i:5000```
