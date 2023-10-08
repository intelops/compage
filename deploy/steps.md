### Steps to install compage with local cassandra cluster on k8s using k8ssandra operator
```shell
./create-kind-cluster.sh

### install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true

### install k8ssandra operator
helm repo add k8ssandra https://helm.k8ssandra.io/stable
helm repo update
helm install k8ssandra-operator k8ssandra/k8ssandra-operator -n k8ssandra-operator --set global.clusterScoped=true --create-namespace

### create cassandra cluster
kubectl apply -n k8ssandra-operator -f k8sc.yml
kubectl get pods -n k8ssandra-operator
kubectl describe k8cs test -n k8ssandra-operator

### Get cassandra username and password
CASS_USERNAME=$(kubectl get secret test-superuser -n k8ssandra-operator -o=jsonpath='{.data.username}' | base64 --decode)
echo $CASS_USERNAME
CASS_PASSWORD=$(kubectl get secret test-superuser -n k8ssandra-operator -o=jsonpath='{.data.password}' | base64 --decode)
echo $CASS_PASSWORD

### Connect to cassandra cluster
kubectl exec -it test-dc1-default-sts-0 -n k8ssandra-operator -- /bin/bash
cqlsh -u test-superuser -p $CASS_PASSWORD

### Fire ddl commands in ddl.sql
```
### Fire below commands to install ingress controller
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s
```

### Create namespace
```shell
kubectl create ns compage
kubens compage
```
### Create docker images [optional if you are installing public chart, you can skip this step. You just need to build the ui docker image and load it into kind cluster]
```shell
./build-docker-images.sh
```

### Load docker images into kind cluster
```shell
kind load docker-image --name compage ghcr.io/intelops/compage/app:v1Next
kind load docker-image --name compage ghcr.io/intelops/compage/core:v1Next
kind load docker-image --name compage ghcr.io/intelops/compage/ui:v1Next
```

### Update image tags and cassandra password in values.yaml
#### Install compage helm chart from compage root directory
```shell
helm install compage charts/compage --values charts/compage/values.yaml
```
#### wait for pods to be ready
```shell
watch kubectl get pods -n compage
```
## Common issues
- https://www.scmgalaxy.com/tutorials/kubernetes-error-1-no-preemption-victims-found-for-incoming-pod/
- https://kind.sigs.k8s.io/docs/user/known-issues/#pod-errors-due-to-too-many-open-files