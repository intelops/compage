# build and deploy
1. Clone the repository and move to root directory of compage project.
    ```shell
    git clone https://github.com/intelops/compage.git
    ```
   
2. Navigate to deploy directory and run below script to create docker images of core, app and ui components. You may want to change the tag there. The same tag you will later need to update in values.yaml of compage's helm chart along with imagePullPolicy set to Never.
   ```shell
    ./build-docker-images.sh   
   ```
   
3. Navigate to compage root directory again and fire below commands one by one in order.
    ```shell
    minikube start
    kubectl create ns compage
    kubectl config set-context --current --namespace=compage
    ```
   or on KinD cluster
   ```shell
    kind create cluster --name compage
    kubectl create ns compage
    kubectl config set-context --current --namespace=compage
   ```

4. Retrieve minikube ip.
   ```shell
   minikube ip
   ```
   or on KinD cluster
   ```shell
   KIND_NODE_IP=$(kubectl get nodes -o wide --no-headers | awk -v OFS='\t' '{print $6}')
   ```
5. Update minikube ip in `/etc/hosts`.
   ```shell
   $MINIKUBE_IP (retrieved by 'minikube ip' command) www.compage.dev
   ```
   or on KinD cluster
   ```shell
   $KIND_NODE_IP (retrieved by above command) www.compage.dev
   ```
6. Fire below command in root directory.
   ```shell
   helm install compage charts/compage --values charts/compage/values.yaml
   ```

7. Wait till pods are up and running in compage ns.
   ```shell
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
   ```
   
8. Go to  http://www.compage.dev:32222 

## Different shell scripts in deploy directory.
### create-kind-cluster.sh
- creates KinD cluster, creates `compage` namespace on it and sets `compage` namespace as default. It later extracts KinD cluster's node ip as well and sets it to KIND_NODE_IP environment variable.
 
### create-minikube-cluster.sh
- creates minikube cluster, creates `compage` namespace on it and sets `compage` namespace as default. It later extracts minikube cluster's node ip as well and sets it to MINIKUBE_NODE_IP environment variable.

### delete-kind-cluster.sh
- deletes the KinD cluster.

### delete-minikube-cluster.sh
- deletes the minikube cluster.

### load-on-kind.sh
- creates KinD cluster, builds docker images for core, app and ui components of compage. The images are then loaded on to KinD cluster. 

### push-docker-images-to-github.sh
- builds docker images for core, app and ui components of compage. The images are then pushed to configured docker registry.