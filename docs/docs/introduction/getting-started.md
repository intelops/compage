---
sidebar_position: 2
---

# Installation

This document covers about how to set up Compage on your local with helm charts and `Compage` will be exposed
through `NodePort` service to the outer world. When you deploy
on
the server, you have to expose the `ui` service using LoadBalancer service type or need to create an ingress.

### Create a KinD cluster

Make sure you have access to Kubernetes cluster along with a capability to install a namespaced scope CRD to your
cluster.
You can create a KinD cluster as explained [here](https://github.com/intelops/compage/blob/main/CONTRIBUTING.md), in
cluster creation section.

### Retrieve KinD cluster Node IP

```shell
# retrieves nodes ip [tested on single node cluster]
$KIND_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
```

#### Update KinD node ip in /etc/hosts.

```shell
$KIND_NODE_IP (retrieved by above command) www.mycompage.dev
```

- You can choose your choice of url above. `www.mycompage.dev` is dummy here. Please make sure that you are using same
  urls in GitHub app as well(redirect url etc.).

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

### Create a namespace

Currently, the `compage` namespace is made hard-coded but in-future, it will be completely configurable.

```yaml
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

### Install the latest version from GitHub helm repository.

Fire below set of commands and install the compage on your KinD cluster running locally.

Before this, you will have to create a docker image for ui component. As this is a UI component and commands in
Dockerfile use below CONFIG values

- REACT_APP_GITHUB_APP_CLIENT_ID
- REACT_APP_GITHUB_APP_REDIRECT_URI
- REACT_APP_COMPAGE_APP_SERVER_URL

to create it, you will have to use your configurations and create a docker image using below commands (run them from base folder of compage)

```shell
TAG_NAME="{version you are installing so that it will be automatically taken.}"
UI_IMAGE="ghcr.io/intelops/compage/ui:$TAG_NAME"
# Assuming this is the name of your kind cluster
CLUSTER_NAME=compage
# create docker image for ui
docker build -t $UI_IMAGE  --network host ui/
kind load docker-image --name $CLUSTER_NAME $UI_IMAGE
```

Once you are done with above commands, kindly run below set of commands. 

```shell
helm repo remove intelops
helm repo add "intelops" "https://raw.githubusercontent.com/intelops/compage/main/charts"
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