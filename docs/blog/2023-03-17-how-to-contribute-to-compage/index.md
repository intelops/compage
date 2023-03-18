---
slug: how-to-contribute-to-compage
title: How to contribute to Compage?
authors: [mahendraintelops]
tags: [open-source, compage]
---
Thanks for your interest in contributing to Compage.

Compage has 3 main components.

![Compage-banner](/img/compage-block-diagram-light.png#gh-light-mode-only)![Compage-banner](/img/compage-block-diagram-dark.png#gh-dark-mode-only)

### core
This is a Go component and a gRPC server. You can contribute to this by adding more generators. When you want to support new protocol or a language or a framework, you will have to majorly add code to this component.
### app
This is a NodeJS component and a gRPC client to the core component. This is also a REST server (express js) to ui component. When you want any new api endpoint for the ui component, you will have to add that here.
Currently, compage supports login with GitHub. When BitBucket or GitLab integration will be added, major code changes will go here.
### ui
This is a ReactJS component and a REST client to app component. This has an integration with aws diagram-maker for canvas. Any changes related to UI will go in this part of compage.

To know how to contribute to Compage, you can check the [Contributing](/docs/contributing.md) section.



