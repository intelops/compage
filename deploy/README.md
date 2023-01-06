1. Clone the repo and move to root dir of compage project.
```shell
git clone https://github.com/kube-tarian/compage.git
```
2. Fire below commands one by one in order.
```shell
minikube start
kubectl create ns compage
kubectl config set-context --current --namespace=compage
```

3. Create docker pull secret as the dokcer images are in private registry. The secret here has just got the read package access.
```shell
kubectl create secret docker-registry compage-pull-secret --docker-server=ghcr.io --docker-username=mahendraintelops --docker-password=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 --docker-email=mahendra.b@intelops.dev
```

4. Retrieve minikube ip.
```shell
minikube ip
```

5. Update minikube ip in `/etc/hosts`.
minikube_ip (retrieved by `minikube ip` command) www.compage.dev

6. Fire below command in root directory.
```shell
helm install compage charts/compage --values charts/compage/values.yaml
```

7. Check if the pods got created.
```shell
kubectl get pods -n compage
```

8. Wait till pods are up and running in compage ns.
```
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
```
9. Go to  http://www.compage.dev:32222 


10. Use below format for serverTypes and clientTypes

```text
======================================
node1
server1
serverTypes
======================================
[
  {
    "protocol": "REST",
    "port": "9999",
    "framework": "net/http",
    "resources": [
      {
        "Name": "User",
        "Fields": {
          "id": "string",
          "name": "string",
          "city": "string",
          "mobileNumber": "string"
        }
      },
      {
        "Name": "Account",
        "Fields": {
          "id": "string",
          "branch": "string",
          "city": "string"
        }
      }
    ]
  }
]

======================================
node2
server2
serverTypes
======================================
[
  {
    "protocol": "REST",
    "port": "9990",
    "framework": "net/http",
    "resources": [
      {
        "Name": "Device",
        "Fields": {
          "id": "string",
          "name": "string",
          "network": "string"
        }
      }
    ]
  }
]
======================================
server1<= server2
edge
clientTypes
======================================
[
  {
    "port": "9999",
    "protocol": "REST"
  }
]
======================================
```


## Release new helm version [for developers only]
```shell
cd charts
#update chart version by updating Chart.yaml
helm package compage
helm repo index .
git add .
git commit -m "new chart version"
git push
```

## Install from published chart
```shell
minikube start
kubectl create ns compage
kubectl config set-context --current --namespace=compage
kubectl create secret docker-registry compage-pull-secret --docker-server=ghcr.io --docker-username=mahendraintelops --docker-password=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 --docker-email=mahendra.b@intelops.dev
minikube ip
```

### update minikube ip in /etc/hosts. minikube_ip (retrieved by minikube ip command) www.compage.dev

## Install latest version from github helm repo
```shell
GITHUB_TOKEN="" # ask Mahendra for token
helm repo remove kube-tarian
helm repo add "kube-tarian" --username $GITHUB_TOKEN --password $GITHUB_TOKEN "https://raw.githubusercontent.com/kube-tarian/compage/main/charts"
helm pull kube-tarian/compage --username $GITHUB_TOKEN --password $GITHUB_TOKEN
helm install compage kube-tarian/compage --values charts/compage/values.yaml
kubectl get pods -n compage

kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-ui
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-core
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=compage-app
```
### Go to http://www.compage.dev:32222