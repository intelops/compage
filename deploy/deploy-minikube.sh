#!/bin/bash
#######################################################################
# create minikube cluster and install everything on minikube cluster          #
#######################################################################
# creates minikube cluster
source ./create-minikube-cluster.sh

# docker in minikube needs to be used so, source build-docker-images.sh can not be used here.

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

echo "Your Minikube cluster has $MINIKUBE_NODE_IP as node ip, please check your github app has the same ip
 in Homepage URL and Authorization callback URL"

echo "Your compage images have been loaded to minikube"
docker exec -it minikube crictl images | grep compage

