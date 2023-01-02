#######################################################################
# Uninstall everything on minikube cluster and delete it                  #
#######################################################################

# deletes resources for ui
kubectl delete -f ../ui/manifests
# deletes resources for app
kubectl delete -f ../app/manifests
# deletes resources for core
kubectl delete -f ../core/manifests
# cleans compage cluster
minikube delete