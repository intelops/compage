<p align="center"><img src="images/compage-logo.svg" width="400" alt=""></p>
<p align="center"><b>Low-Code, No-Code for cloud-native</b></p>

<h4 align="center">
    <a href="https://discord.gg/DeapQc22qe">Discord</a> |
    <a href="https://github.com/intelops/compage/discussions">Discussions</a> |
    <a href="https://docs.intelops.ai/1.0.0/compage/5-guides?utm_source=github&utm_medium=social/">Guide</a> |
    <a href="https://docs.intelops.ai/1.0.0/compage">Docs</a> |
    <a href="https://docs.intelops.ai/1.0.0/compage/6-contribution?utm_source=github&utm_medium=social">Contribute</a><br/><br/>
</h4>

<h4 align="center">

![compage-ci](https://github.com/intelops/compage/workflows/core-ci/badge.svg)
[![codecov](https://codecov.io/gh/intelops/compage/branch/main/graph/badge.svg?token=HZZ0196V4D)](https://codecov.io/gh/intelops/compage)
[![Go Report Card](https://goreportcard.com/badge/github.com/intelops/compage/core)](https://goreportcard.com/report/github.com/intelops/compage/core)

[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/intelops/compage/blob/main/LICENSE) [![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/DeapQc22qe)
[![Discussions](https://badgen.net/badge/icon/discussions?label=open)](https://github.com/intelops/compage/discussions)
[![Code of Conduct](https://badgen.net/badge/icon/code-of-conduct?label=open)](./code-of-conduct.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

</h4>

<hr>

# Compage by IntelOps

Low-Code Framework to develop Rest APIs, gRPC, dRPC, GraphQL APIs, WebSockets, Micro-services, FaaS, Temporal workloads,
IoT and edge services, K8s controllers, K8s CRDs, K8s custom APIs, K8s Operators, K8s hooks, etc. with visual coding and
by automatically applying best practice methods like software supply chain security measures, SBOM, openAPI,
cloud-events, vulnerability reports, etc. Auto generate code after defining requirements in UI as architecture diagram.

**Specify the requirements for backend workloads in the yaml file, and then auto-generate code, customize it and maintain it.**
> Our goal is to support both auto-generate code and import existing code. Let's see how far we can go with importing
> existing code support. One step at a time!

#### Problems that Compage is trying to solve:

Problems with many of the current low-code platforms -

- Single programming language support only.
- Vendor Lock-in Infrastructure if you want to choose their cloud hosting.
- No proper support or automation for self-hosting and also lots of dependencies on the low-code/no-code tool itself to
  run it on your infrastructure.
- No Zero-Vendor Lock-in platform to generate cloud-native. friendly backend source code, especially for Rest APIs,
  gRPC,
  WebSockets, etc. in any programming language and framework we want.
- Non-availability of a very opinionated development process & management of infrastructure.
- Not compatible to cloud-native, especially for self-hosting K8s environment.
- Not invoking standards like openAPI, Event-driven, software supply chain security, secure container builds,
  microservices, etc.
- Not supporting modern tech stack and no feasibility to adopt new tech stack dynamically.
- No bi-directional code management (export, import and manage).
- No easy UX to make any level of developer to learn, adopt and implement development process for K8s ecosystem for
  cloud-native world.
- and the list can go on **(please let us know what more you can think of, we will try to solve those problems for you)
  **

Solution: **Compage**

- An opensource tool that can be run on your local and used to develop backend workloads for cloud-native & K8s :-
- Easy to adopt & use.
- GitHub Actions, container build tools, cosign, etc.
- Select the programming language and framework you prefer (support for each programming language and framework will be
  added one by one); first priority is GoLang and Rust. Frameworks can be configured as plug-ins.
- Auto generate code for backend workloads like Rest API, gRPC, dRPC, GraphQL, WebSockets, Microservices, FaaS,
  Temporal workloads, IoT and edge services, K8s controllers, K8s CRDs, K8s custom APIs, K8s Operators, K8s hooks, etc.
  **(for now support will be for golang and then Rust as priority, followed by Python, C, Carbon, Node.js, Dart, Deno,
  etc. Community contribution will help us to achieve more support)**
- Auto-generate the backend code, based on requirements defined via diagram & forms
- Auto-generate the endpoint configs to be able to use with API gateways & service-mesh environments like Kong, Tyk,
  Easegress, Istio, Linkerd, Kuma, Ngnix, Cilium tools, Calico, etc.
- Easy plug-ins by supporting tools like Ory Hydra, Kratos, Keto, OathKeeper, KeyCloak, Gluu, Janssen, Cerbos, Open
  Policy Agent, OAuth, OIDC, FIDO, SAML, Dex, MFA, Passwordless, etc.
- Auto build containers as multi-stage and/or distroless to make them secure, portable and optimal.
- Automatically take care of all git processes like tagging, versioning, commits, PRs, etc.
- Automatically enforce software supply chain security process like signing the source code for integrity and generating
  immutable ledger logs, generating SBOM, generating vulnerability report, and also generate configurations to auto
  verify, validate & control the source code integrity and container image integrity for deployments, etc. in K8s env.
- Automatically convert backend application related environment variables' content to configmaps, secrets, etc. to make
  the generated backend compatible to K8s of any flavor (K8s, K3s, TalOS, etc.) and also auto configs to support
  integration with Vault, cert-manager, external secrets, sealed secrets & Venafi tools for TLS/SSL and secrets
  management.
- Slowly add support for ML development & ML frameworks to make it easy to develop ML applications that will run on
  Kubernetes.
- **Automatically manage generated code for by auto creating the services catalog & their visualization by versioning
  and integrations, and also git repo observability**
- **please suggest what you would like to add as features**

-------------------------

#### Current features in compage
- An opensource tool that runs on your local cluster (mostly a local cluster running on developer's machine), helps to
  visually develop backend workloads for cloud-native & K8s.
- Easy to adopt & use.
- GitHub Actions, container build tools, cosign, etc.
- Auto-generate code for backend workloads like Rest API.
- Auto-generate the backend code, based on requirements defined via diagram & forms.
- Auto build containers as multi-stage and/or distro-less to make them secure, portable and optimal.
- Automatically enforce software supply chain security process like generating cosign configuration in GitHub actions
  for generated source code for the diagrams drawn, generating deepsource configurations, generating configurations for
  deployments, services etc. in K8s env.

#### Languages supported:

> OpenApi Generator based templates (REST)

- GoLang
- Java
- Python
- JavaScript
- Ruby
- **we would like to add more support to different languages. Please feel free to suggest.**

> Compage managed templates (REST)

- Go
- Rust (in progress)

Support of different programming languages, protocols and frameworks will be added one by one with community
contribution.

#### How to use Compage?

- A user can download the compage executable binary from releases page suitable for the user's machine architecture. The user can even build the binary from source code.
- Once the binary is downloaded, user can create a yaml file as configuration to be supplied to compage binary. The yaml file can be created by running the command `compage init` and then user can edit the yaml file to add the required configuration.

#### Build from source code
```shell
## clone the repo
git clone https://github.com/intelops/compage.git
## change directory to compage
cd compage
go build -o compage .
## initialize the config.yaml file
./compage init
## edit the config.yaml file as per your requirement
## generate the code. Below command accepts serverType [rest, grpc and rest-grpc] 
./compage generate grpc
```

## Contributing

You are warmly welcome to contribute to Compage.
Please refer the detailed guide [CONTRIBUTING.md](./CONTRIBUTING.md).

## Community

Active communication channels

- Discord: [Discord](https://discord.gg/DeapQc22qe)

## License

Refer the licence - [LICENCE](./LICENSE).

## Star History

<a href="https://star-history.com/#intelops/compage&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=intelops/compage&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=intelops/compage&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=intelops/compage&type=Date" />
  </picture>
</a>

