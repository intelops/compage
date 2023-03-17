---
sidebar_position: 1
---

# What is Compage?

### Overview

![Compage-banner](/img/compage-light.png#gh-light-mode-only)![Compage-banner](/img/compage-dark.png#gh-dark-mode-only)

**Compage** is the `open-source` project by IntelOps.

Compage was pictured in mind after facing troubles while bootstrapping new projects and adding integrations of standard
practices.

As a project, Compage's goal is to help developers **spend less time in bootstrapping projects** and follow standard
practices all the time. What's offered from this project is that you can draw diagrams, create connections between the
nodes(microservices) and get the skeleton projects generated which follow standard cloud-native practices.

Compage is a low-code framework to develop Rest APIs, gRPC, dRPC, GraphQL APIs, WebSockets, Micro-services, FaaS,
Temporal workloads,
IoT and edge services, K8s controllers, K8s CRDs, K8s custom APIs, K8s Operators, K8s hooks, etc. with visual coding
and
by automatically applying best practice methods like software supply chain security measures, SBOM, openAPI,
cloud-events, vulnerability reports, etc. auto generate code after defining requirements in UI as architecture
diagram.

**Draw the requirements for backend workloads, and then auto generate code, customize it and maintain it.**
> Our goal is to support both auto-generate code and import existing code. Let's see how far we can go with importing
> existing code support. One step at a time!

### Problem statement:

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

### Solution: **Compage**

- An opensource tool that runs on your k8s cluster (can be deployed once per team), helps to visually develop backend
  workloads for cloud-native & K8s :-
- Easy to adopt & use UI/UX.
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
  and integrations, and also git repo observability.**
- **Please suggest what you would like to add as features.**

-------------------------

### Current features in compage

- An opensource tool that runs on your k8s cluster (mostly a local cluster running on developer's machine), helps to
  visually develop backend workloads for cloud-native & K8s.
- Easy to adopt & use UI.
- GitHub's integration for authentication, container build tools, cosign, etc.
- Equipped with diagramming library to define the project requirements by drawing the flow of backend workloads.
- Annotations, labels, tags, versioning, etc. can be defined within the diagram using forms.
- Auto generate code for backend workloads like Rest API.
- Auto generate the backend code, based on requirements defined via diagram & forms.
- Auto build containers as multi-stage and/or distro-less to make them secure, portable and optimal.
- Automatically take care of all git processes like tagging, versioning, commits, PRs, etc.
- Automatically enforce software supply chain security process like generating cosign configuration in GitHub actions
  for generated source code for the diagrams drawn, generating deepsource configurations, generating configurations for
  deployments, services etc. in K8s env.
- Can be deployed directly with docker images or via Helm chart. Helm chart is the tested and preferred way. Even if you
  are deploying compage with docker images, you still need K8s cluster access to persist project and user data in etcd
  as CRs.

#### Languages supported:

> OpenApi Generator based templates (REST services)

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

### Architecture

![Compage-banner](/img/compage-architecture-light.png#gh-light-mode-only)![Compage-banner](/img/compage-architecture-dark.png#gh-dark-mode-only)

Compage runs on any K8s cluster. Compage uses K8s custom resource as a store for projects and users. Compage currently
has a support for `Login with Github`. Once user logs into the Compage, user can create projects. The information of
projects created on Compage is stored in K8s and code generated by Compage is stored on GitHub.

When user tries to log in to Compage, user is redirected to GitHub for login and asked for permissions to access
repository. Once user provides permissions, user logs into the compage. A User CR will be created post user signs into
the Compage along with the GitHub token retrieved by the earlier process.

User now needs to create a project before he could use the Canvas to draw diagrams.
When the project is created in Compage, a project CR is created on K8s cluster(where your Compage is running). This
process also creates a repository on GitHub and creates a .compage directory in it. As Compage makes use of aws
diagram-maker, the configuration of the canvas can be exported to json. We can redraw the components on canvas using
that json. Compage stores that json under .compage directory in config.json file. On every click of `Save project`, this
file is updated in GitHub repository with the latest state of canvas.

Compage has 3 components: core, app and ui.

- core
    - This is a `Go` component and acts as code generator for the configurations passed.
    - This component considers the configuration passed from `app` and runs it on the templates.
    - This component is a gRPC server to `app` component and streams the generated code back to `app`.
    - Currently, it supports REST protocol and two types of REST templates are supported as of now.
        1. Compage managed templates
           The Compage managed templates are git submodules in the `core` component. If you want to support more
           frameworks or languages, you have to add the template in a separate repository and import it as submodule in
           this project. The current template for `Go` is a separate
           repository - https://github.com/intelops/compage-template-go.git
        2. OpenApi Generator templates
- app
    - This is a `NodeJs` component and is responsible for authentication with GitHub and all the GitHub related
      operations.
    - This component is a REST server to `ui` component and also a gRPC client to `core`.
    - Further additions of other logins and GitHub operations will be done in this component.
- ui
    - This is a `ReactJs` component and has an integration with aws diagram-maker for canvas.
    - User draws diagram and the json created out of it is used to generate the code.
