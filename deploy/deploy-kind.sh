#!/bin/bash

source ./create-kind-cluster.sh
source ./build-docker-images.sh

# load docker images for core, app and ui
kind load docker-image --name $CLUSTER_NAME $CORE_IMAGE
kind load docker-image --name $CLUSTER_NAME $APP_IMAGE
kind load docker-image --name $CLUSTER_NAME $UI_IMAGE

echo "Your KinD cluster has $KIND_NODE_IP as node ip, please check your github app has the same ip in Homepage URL and Authorization callback URL"

echo "Your compage images have been loaded to cluster : $CLUSTER_NAME"
docker exec -it ${CLUSTER_NAME}-control-plane crictl images | grep compage
