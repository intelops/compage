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

#### Create a KinD cluster

```shell
# kind-config.yaml file is available in the deploy folder.
kind create cluster --name compage --config kind-config.yaml
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

### Create namespace
```yaml
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

### Install ingress-nginx using below command.
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### Build compage/ui locally
We still need to manually build the docker image for compage/ui. The compage/ui docker image consists of ReactJs code being served via nginx. As the ReactJs code uses `Login with Github` so, GitHub App credentials are required while building the ReactJs app (I haven't found better way to handle this yet.)

To create compage/ui docker image, please follow the steps given below.
You have to populate ui/.env.production file in root directory of compage with the `GitHub App Credentials`.

```shell
TAG_NAME="v0.0.1"
UI_IMAGE="ghcr.io/intelops/compage/ui:$TAG_NAME"
docker build -t $UI_IMAGE  --network host ../ui/
kind load docker-image --name $CLUSTER_NAME $UI_IMAGE

echo "Your compage images have been loaded to cluster : $CLUSTER_NAME"
docker exec -it ${CLUSTER_NAME}-control-plane crictl images | grep compage
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

### Go to http://localhost:32222

### Uninstall everything created on k8s cluster.

Simply, delete the cluster created above using `kind delete cluster --name compage`. If that's not possible, delete the namespace `kubectl delete ns compage`.