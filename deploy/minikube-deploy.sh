#######################################################################
# create minikube cluster and install everything on minikube cluster          #
#######################################################################
CLUSTER_NAME=compage
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

TAG_NAME="0.0.1"
CORE_IMAGE="ghcr.io/mahendraintelops/compage/core:$TAG_NAME"
APP_IMAGE="ghcr.io/mahendraintelops/compage/app:$TAG_NAME"
UI_IMAGE="ghcr.io/mahendraintelops/compage/ui:$TAG_NAME"

# set the docker env
eval $(minikube docker-env)

# create docker images for core, app and ui
docker build -t $CORE_IMAGE  --network host ../core/
docker build -t $APP_IMAGE  --network host ../app/
docker build -t $UI_IMAGE  --network host ../ui/

## update image tags for core, app and ui
#sed -i "s#{{CORE_IMAGE}}#$CORE_IMAGE#" ../core/manifests/deployment.yaml
#sed -i "s#{{APP_IMAGE}}#$APP_IMAGE#" ../app/manifests/deployment.yaml
#sed -i "s#{{UI_IMAGE}}#$UI_IMAGE#" ../ui/manifests/deployment.yaml
#
########################################################################
## Make sure you have created docker images and updated the image tags #
## in respective deployments                                           #
########################################################################

# creates resources for core
#kubectl apply -f ../core/manifests
# creates resources for app
#kubectl apply -f ../app/manifests
# creates resources for ui
#kubectl apply -f ../ui/manifests

echo "Your Minikube cluster has $MINIKUBE_NODE_IP as node ip, please check your github app has the same ip
 in Homepage URL and Authorization callback URL"

echo "Your compage images have been loaded to cluster : $CLUSTER_NAME"
docker exec -it minikube crictl images | grep compage


#echo "Access your app at http://"$MINIKUBE_NODE_IP":32222 ."
