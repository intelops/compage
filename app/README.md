# app
- This component integrates the GitHub Oauth2 App for authentication.
- This also uses K8s's etcd store to persist projects and users related data.
- It's an Express JS based REST server and gRPC client to core component.

#### How to run this component?
- Navigate to app directory [`cd app`] from root directory of compage
- Fire `npm install` to install the dependencies
- Install the CRDs for projects and users (when you are running for the first time.) by firing below commands
    - `kubectl create ns compage`
    - `kubectl config set-context --current --namespace=compage`
    - `kubectl apply -f crds/project-crd.yaml`
    - `kubectl apply -f crds/user-crd.yaml`
- Check if you are able to list `projects` and `users`. You should see below just after you fire above commands for the first time.
```shell
  ❯ kubectl get projects -A
  No resources found 
```
  and
```shell
  ❯ kubectl get users -A
  No resources found 
```
- If you find some other error apart from the above one, that means the installation of CRDs didn't succeed.
- Run `npm run dev` command to start the express-server. This command will auto-reload the changes you make to app directory.