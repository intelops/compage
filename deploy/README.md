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
minikube_ip (retrieved by `minikube ip` command) www.compage.io

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
9. Go to  http://www.compage.io:32222 
