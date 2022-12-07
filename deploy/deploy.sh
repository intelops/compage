#######################################################################
# create kind cluster and install everything on kind cluster          #
#######################################################################

# creates kind cluster with name compage
kind create cluster --name compage --config kind-config.yaml
# creates compage namespace
kubectl create namespace compage
# creates redis namespace
kubectl create namespace redis

# retrieves nodes ip [tested on single node cluster]
KIND_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
sed -i "s/{{KIND_NODE_IP}}/$KIND_NODE_IP/" ../app/manifests/configmaps.yaml
sed -i "s/{{KIND_NODE_IP}}/$KIND_NODE_IP/" ../ui/manifests/configmaps.yaml

TAG_NAME="first"
CORE_IMAGE="ghcr.io/mahendraintelops/compage/core"+$TAG_NAME
APP_IMAGE="ghcr.io/mahendraintelops/compage/app"+$TAG_NAME
UI_IMAGE="ghcr.io/mahendraintelops/compage/ui"+$TAG_NAME

# create docker images for core, app and ui
docker build -t $CORE_IMAGE ../core/
docker build -t $APP_IMAGE ../app/
docker build -t $UI_IMAGE ../ui/

# load docker images for core, app and ui
kind load docker-image $CORE_IMAGE
kind load docker-image $APP_IMAGE
kind load docker-image $UI_IMAGE

# update KIND_NODE_IP in configmaps
sed -i "s/{{KIND_NODE_IP}}/$KIND_NODE_IP/" ../app/manifests/configmaps.yaml
sed -i "s/{{KIND_NODE_IP}}/$KIND_NODE_IP/" ../ui/manifests/configmaps.yaml

# update image tags for core, app and ui
sed -i "s/{{CORE_IMAGE}}/$CORE_IMAGE/" ../core/manifests/deployment.yaml
sed -i "s/{{APP_IMAGE}}/$APP_IMAGE/" ../app/manifests/deployment.yaml
sed -i "s/{{UI_IMAGE}}/$UI_IMAGE/" ../ui/manifests/deployment.yaml

#######################################################################
# Make sure you have created docker images and updated the image tags #
# in respective deployments                                           #
#######################################################################

# creates resources for core
kubectl apply -f ../core/manifests
# creates resources for app
kubectl apply -f ../app/manifests
# creates resources for ui
kubectl apply -f ../ui/manifests

echo "Your KinD cluster has $KIND_NODE_IP as node "
