<p style="text-align:center"><img src="compage-logo.png" width="400" alt=""></p>
<p style="text-align:center"><b>Low-Code No-Code for Cloud Native</b></p>

<p style="text-align:center">
  <a href="code_of_conduct.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
</p>

<hr>

# Compage by intelops
Low-Code Framework to develop Rest APIs, gRPC, dRPC, GraphQL APIs, WebSockets, Micro-services, FaaS, Temporal workloads,
IoT and edge services, K8s controllers, K8s CRDs, K8s custom APIs, K8s Operators, K8s hooks, etc. with visual coding and
by automatically applying best practice methods like software supply chain security measures, SBOM, openAPI,
cloud-events, vulnerability reports, etc. Auto generate code after defining requirements in UI as architecture diagram.

**Draw the requirements for backend workloads, and then auto generate code, customize it and maintain it.**
> Our goal is to support both auto-generate code and import existing code. Let's see how far we can go with importing
> existing code support. One step at a time!

#

#### Supports:
- GoLang
- Java
- Python
- JavaScript
- Ruby
- **we would like to add more support to different languages. Please feel free to suggest.**

> support of different programming languages and frameworks will be added one by one with community contribution.

------------
#### Problems that Compage is trying to solve:

Problems with many of the current low-code platforms -
- Single programming language support only.
- Vendor Lock-in Infrastructure if you want to choose their cloud hosting.
- No proper support or automation for self-hosting and also lots of dependencies on the low-code/no-code tool itself to
  run it on your infrastructure.
- No Zero-Vendor Lock-in platform to generate cloud-native. friendly backend source code, especially for Rest APIs, gRPC,
  WebSockets, etc. in any programming language and framework we want.
- Non-availability of a very opinionated development process & management of infrastructure.
- Not compatible to cloud-native, especially for self-hosting K8s environment.
- Not invoking standards like openAPI, Event-driven, software supply chain security, secure container builds,
  microservices, etc.
- Not supporting modern tech stack and no feasibility to adopt new tech stack dynamically.
- No bi-directional code management (export, import and manage).
- No easy UX to make any level of developer to learn, adopt and implement development process for K8s ecosystem for cloud-native world.
- and the list can go on **(please let us know what more you can think of, we will try to solve those problems for you)**

Solution: **Compage** 
- An opensource tool that runs on your k8s cluster (mostly a local cluster running on developer's machine), helps to visually develop backend workloads for cloud-native & K8s :-
- easy to adopt & use UI/UX.
- GitHub's integration, container build tools, cosign, etc.
- Equipped with diagramming library to define the project requirements by drawing the flow of backend workloads.
- Annotations, labels, tags, versioning, etc. can be defined within the diagram using forms.
- Select the programming language and framework you prefer (support for each programming language and framework will be
  added one by one); first priority is GoLang and Rust. Frameworks can be configured as plug-ins.
- Auto generate code for backend workloads like Rest API, gRPC, dRPC, GraphQL, WebSockets, Microservices, FaaS,
  Temporal workloads, IoT and edge services, K8s controllers, K8s CRDs, K8s custom APIs, K8s Operators, K8s hooks, etc.
  **(for now support will be for golang and then Rust as priority, followed by Python, C, Carbon, Node.js, Dart, Deno,
  etc. Community contribution will help us to achieve more support)**
- Auto generate the backend code, based on requirements defined via diagram & forms
- Auto generate the endpoint configs to be able to use with API gateways & service-mesh environments like Kong, Tyk,
  Easegress, Istio, Linkerd, Kuma, Ngnix, Cilium tools, Calico, etc.
- Easy plug-ins by supporting tools like Ory Hydra, Kratos, Keto, OathKeeper, KeyCloak, Gluu, Janssen, Cerbos, Open
  Policy Agent, OAuth, OIDC, FIDO, SAML, Dex, MFA, Passwordless, etc.
- Auto build containers as multi-stage and/or distroless to make them secure, portable and optimal
- Automatically take care of all git processes like tagging, versioning, commits, PRs, etc.
- Automatically enforce software supply chain security process like signing the source code for integrity and generating
  immutable ledger logs, generating SBOM, generating vulnerability report, and also generate configurations to auto
  verify, validate & control the source code integrity and container image integrity for deployments, etc. in K8s env
- Automatically convert backend application related environment variables' content to configmaps, secrets, etc. to make
  the generated backend compatible to K8s of any flavor (K8s, K3s, TalOS, etc.) and also auto configs to support
  integration with Vault, cert-manager, external secrets, sealed secrets & Venafi tools for TLS/SSL and secrets
  management
- Slowly add support for ML development & ML frameworks to make it easy to develop ML applications that will run on
  Kubernetes
- **Automatically manage generated code for by auto creating the services catalog & their visualization by versioning
  and integrations, and also git repo observability**
- **please suggest what you would like to add as features**

-------------------------