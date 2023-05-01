---
markmap:
  colorFreezeLevel: 2
---

# compage

## doc
- [Compage Docs](https://docs.intelops.ai/1.0.0/compage)

## app
- NodeJs Express Server
- [Repository](https://github.com/intelops/compage/tree/main/app)
- GitHub Integration
- gRPC Client to core
- Commit generated code to user's GitHub account using Simple-Git
- Integration with K8s [store the projects details to etcd through K8s custom resources]

## core
- gRPC Go Server
- [Repository](https://github.com/intelops/compage/tree/main/core)
- Code Generation with Go templates
- [openapi-generator Integration](https://openapi-generator.tech)

## ui
- ReactJS based Rest client - typescript based CRA app
- [Repository](https://github.com/intelops/compage/tree/main/ui)
- aws-diagram-maker library integration

## chart
- Helm Chart for compage

## deploy
- scripts to create docker images and push to ghcr.io registry.