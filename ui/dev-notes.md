**How to build ui for deployment?**

**yarn run build:production**

This uses .env.production and creates builds for production. This is still giving problems as the localhost:3000 string
is prepended to api url when its getting called.

**yarn run build:staging**

This uses .env.staging file and creates build with staging values.

How to run on UI local computer?

1. Clone compage project from `git@github.com:kube-tarian/compage.git`
2. Navigate to compage/ui
3. Create .env.development file in the root directory of compage you just created. You need to add below keys
```
REACT_APP_GITHUB_APP_CLIENT_ID=5f16d808ffab8200032d
REACT_APP_GITHUB_APP_REDIRECT_URI=http://localhost:3000/login
REACT_APP_COMPAGE_APP_SERVER_URL=localhost:5000
```

4. Fire `yarn` and then `yarn install`.
5. Run `devspace dev` and then


### Release new build
1. Fire `yarn run build:production` to create the production build [You need to have .env.production file at the level of package.json]
2. Install any serving tools like `serve` or `http-server` and fire below command [`serve -s build` or ``]