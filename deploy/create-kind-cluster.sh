#######################################################################
# create kind cluster and install everything on kind cluster          #
#######################################################################
CLUSTER_NAME=compage
# creates kind cluster with name compage
kind create cluster --name $CLUSTER_NAME --config kind-config.yaml
# creates compage namespace
kubectl create namespace compage
kubectl config set-context --current --namespace=compage

# retrieves nodes ip [tested on single node cluster]
KIND_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
if [ -z "$KIND_NODE_IP" ]; then
  echo "KIND_NODE_IP: \$KIND_NODE_IP is empty"
  exit 0
fi
