# create kind cluster and install everything on kind cluster
# creates kind cluster with name compage
kind create cluster --name compage --config kind-config.yaml
# creates compage namespace
kubectl create namespace compage
# creates redis namespace
kubectl create namespace redis
# creates resources for core
kubectl apply -f ../core/manifests
# creates resources for app
kubectl apply -f ../app/manifests
# creates resources for ui
kubectl apply -f ../ui/manifests