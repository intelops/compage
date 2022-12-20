## project structure

- app
- ui
- charts
- core
- deploy
- docs

## what contains what?

## How to run app ?

- development
- production

### app

- Create any k8s cluster
  ```
  kind create cluster
  ```
- deploy crd even if you are not deploying compage to k8s. This is to store users and projects of the user. Fire below commands from root dir of compage

  ```
  kubectl create namespace compage
  kubectl apply -f app/manifests/project-crd.yaml
  kubectl apply -f app/manifests/user-crd.yaml
  ```

- if you want to refer the same projects, you can take backup of the projects and users before you delete the cluster

### core
golang project
- `go run main.go`
### ui
reactjs application
- `yarn run start`