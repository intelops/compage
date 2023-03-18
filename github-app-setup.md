- Register a new app on GitHub to retrieve `clientId` and `clientSecret` by following steps given on this link - https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/creating-a-github-app. Update the `clientId` and `clientSecret` in ui/.env.development [For dev-environment]
 ```shell
 # production config
 # github config
 REACT_APP_GITHUB_APP_CLIENT_ID=XXXXXX
 REACT_APP_GITHUB_APP_REDIRECT_URI=http://www.mycompage.dev:32222/login
 # compage-app config
 REACT_APP_COMPAGE_APP_SERVER_URL=http://www.mycompage.dev:31111
 ```
and add below keys in ~/.compage/.env  [For dev-environment]
   ```shell
   # github config
   GITHUB_APP_CLIENT_ID=XXXXXXXX
   GITHUB_APP_CLIENT_SECRET=XXXXXXXX
   GITHUB_APP_REDIRECT_URI=http://localhost:3001/login
   # compage-core config
   COMPAGE_CORE_URL=localhost:50051
   ```
