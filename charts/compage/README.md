## Release new helm-chart version for compage

```shell
cd charts
# update chart version by updating Chart.yaml
helm package compage
helm repo index .
git add .
git commit -m "new chart version"
git push
```

---

## Install from published chart

#### Create a minikube cluster

```shell
minikube start
kubectl create ns compage
kubectl config set-context --current --namespace=compage
minikube ip
```

#### Update minikube ip in /etc/hosts.

```shell
$MINIKUBE_IP (retrieved by minikube ip command) www.mycompage.dev
```

#### Create a KinD cluster

```shell
kind create cluster --name compage
kubectl create ns compage
kubectl config set-context --current --namespace=compage
# retrieves nodes ip [tested on single node cluster]
KIND_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
```

#### Update KinD node ip in /etc/hosts.

```shell
$KIND_NODE_IP (retrieved by above command) www.mycompage.dev
```

### Register an app on GitHub

To run `Compage` (on your local or on the server), you have to first set up GitHub app.

- Register a new app on GitHub to retrieve clientId and clientSecret by following steps given on this
  link - https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/creating-a-github-app.
  Update the clientId and clientSecret in values.yaml like below.

```yaml
githubApp:
  # update below value cluster's node ip and with port specified here (.Values.ui.service.nodePort)
  redirectURI: "http://www.mycompage.dev:32222/login"
  clientId: "XXXXXXXX"
  clientSecret: "XXXXXXXX"
ui:
  compageApp:
    #   update below value cluster's node ip and with port specified here (.Values.app.service.nodePort)
    serverUrl: http://www.mycompage.dev:31111
```

### Create namespace

Currently, the `compage` namespace is made hard-coded but in-future, it will be completely configurable.

```yaml
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

### Install the latest version from GitHub helm repository.

```shell
helm repo remove intelops
helm repo add "intelops" "https://raw.githubusercontent.com/intelops/compage/main/charts"
helm pull intelops/compage
helm install compage intelops/compage --values charts/compage/values.yaml
kubectl get pods -n compage
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
```

### Go to http://www.mycompage.dev:32222

### Uninstall

Simply, delete the cluster created above using `kind delete cluster --name compage`. If that's not possible, delete the
namespace `kubectl delete ns compage`