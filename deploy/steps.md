### Steps to create a cassandra cluster on k8s using k8ssandra operator
./create-kind-cluster.sh

helm repo add k8ssandra https://helm.k8ssandra.io/stable
helm repo update
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true
helm install k8ssandra-operator k8ssandra/k8ssandra-operator -n k8ssandra-operator --set global.clusterScoped=true --create-namespace

kubectl apply -n k8ssandra-operator -f k8sc.yml
kubectl get pods -n k8ssandra-operator
kubectl describe k8cs test -n k8ssandra-operator
CASS_USERNAME=$(kubectl get secret test-superuser -n k8ssandra-operator -o=jsonpath='{.data.username}' | base64 --decode)
echo $CASS_USERNAME
CASS_PASSWORD=$(kubectl get secret test-superuser -n k8ssandra-operator -o=jsonpath='{.data.password}' | base64 --decode)
echo $CASS_PASSWORD
kubectl exec -it test-dc1-default-sts-0 -n k8ssandra-operator -- /bin/bash
cqlsh -u test-superuser -p $CASS_PASSWORD

### Fire ddl commands in ddl.sql
### Fire below commands to install ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

### Create namespace
kubectl create ns compage
kubens compage

### Create docker images
./build-docker-images.sh

### Load docker images into kind cluster
kind load docker-image --name compage ghcr.io/intelops/compage/app:nextv2
kind load docker-image --name compage ghcr.io/intelops/compage/core:nextv2
kind load docker-image --name compage ghcr.io/intelops/compage/ui:nextv2

### Update image tags and cassandra password in values.yaml
### Install compage helm chart from compage root directory
helm install compage charts/compage --values charts/compage/values.yaml

### wait for pods to be ready
watch kubectl get pods -n compage

## Common issues
https://www.scmgalaxy.com/tutorials/kubernetes-error-1-no-preemption-victims-found-for-incoming-pod/#:~:text=The%20error%20message%20%E2%80%9C0%2F1,to%20meet%20the%20pod's%20requirements.
https://kind.sigs.k8s.io/docs/user/known-issues/#pod-errors-due-to-too-many-open-files