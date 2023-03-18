---
sidebar_position: 1
---

# How to use Compage?

End users of the Compage are developers in team. A developer as a user

- Logs in to the compage using his/her GitHub credentials. He/she needs to provide permissions for the Compage GitHub
  App to create repositories on his/her behalf, commit generated code to the repositories.
- Selects from existing projects or creates a new project from the dialog box presented.
  A compage project has a one-to-one relationship with GitHub repository. The compage project's connected GitHub
  repository can contain all the generated source code for all the nodes created on drawing panel. Compage follows
  monorepo method, all connected microservices in single git repository.
- Uses drawing canvas to create nodes and configure one by one using forms after double-clicking on nodes. At last,
  he/she saves the project and hits `Generate Code` button. The code will be generated and saved to connected GitHub
  repository for that project.
- Uses same panel to add more microservices(nodes) or modify existing microservices. When the code is generated, version
  is locked till that point and any change made post code-generation till next code-generation is part of next version.
  User's can have at most 10 versions per project as of now. Moving between versions is not yet supported.

1. [Create a node](./create-a-node.md)
2. [Create an edge](./create-an-edge.md)
