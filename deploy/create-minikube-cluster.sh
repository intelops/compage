#######################################################################
# create minikube cluster and install everything on minikube cluster          #
#######################################################################
# creates minikube cluster with name compage
minikube start
# creates compage namespace
kubectl create namespace compage
kubectl config set-context --current --namespace=compage

# retrieves nodes ip [tested on single node cluster]
MINIKUBE_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
if [ -z "$MINIKUBE_NODE_IP" ]; then
  echo "MINIKUBE_NODE_IP: \$MINIKUBE_NODE_IP is empty"
  exit 0
fi