# build and deploy
1. Clone the repository and move to root directory of compage project.
    ```shell
    git clone https://github.com/intelops/compage.git
    ```
   
2. Navigate to deploy directory and run below script to create docker images of core, app and ui components. You may want to change the tag there. The same tag you will later need to update in values.yaml for helm chart of compage along with imagePullPolicy set to Never. You need to change the `GitHub app configuration` in values.yaml too.
   ```shell
    ./build-docker-images.sh   
   ```
   
3. Navigate to compage root directory again and fire below commands one by one in order.
   ```shell
    # kind-config.yaml file is available in the deploy folder.
    kind create cluster --name compage --config kind-config.yaml
    kubectl create ns compage
    kubectl config set-context --current --namespace=compage
   ```

4. Fire below command in root directory.
   ```shell
   helm install compage charts/compage --values charts/compage/values.yaml
   ```

5. Wait till pods are up and running in compage ns.
   ```shell
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
   kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
   ```
   
6. Install ingress-nginx using below command.
   ```shell
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
   
   kubectl wait --namespace ingress-nginx \
     --for=condition=ready pod \
     --selector=app.kubernetes.io/component=controller \
     --timeout=90s
   ```

7. Go to  http://localhost:32222 

## Different shell scripts in deploy directory.
### create-kind-cluster.sh
- This script creates KinD cluster, creates `compage` namespace on it and sets `compage` namespace as default. It later extracts KinD cluster's node ip as well and sets it to KIND_NODE_IP environment variable.
 
### delete-kind-cluster.sh
- This script deletes the KinD cluster.

### load-on-kind.sh
- creates KinD cluster, builds docker images for core, app and ui components of compage. The images are then loaded on to KinD cluster. 

### push-docker-images-to-github.sh
- This script builds docker images for core, app and ui components of compage. The images are then pushed to configured docker registry.