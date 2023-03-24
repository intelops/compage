# core
- This component consists of code generators for configuration passed from app.
- It makes use of openapi-generator to generate the code. It also has git submodules, each representing a custom code template for different languages.
- It's a Golang based gRPC server to app component.

#### How to run this component?
- Navigate to core directory [cd app] from root directory of compage.
- Fire below set of commands in sequence to initialize the git submodules.
    -- `git submodule init`
    -- `git submodule update --remote`
- Fire `go mod tidy` to install the dependencies.
- Run command `go run main.go` to start the gRPC server.
