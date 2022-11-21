package core

// Type depicts the ServerType and ClientType(gRPC, REST or WS)
type Type struct {
	Config map[string]string `yaml:"config"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}
