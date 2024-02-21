package models

type Data struct {
	Code     string `json:"code"`
}

type DocGenData struct {
	Docs string `json:"docs"`
}

type CodeGenResponse struct {
	Status  string `json:"status"`
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    Data   `json:"data"`
}

type LLMAccessToken struct {
	AccessToken string  `json:"access_token"`
	ExpiresIn   float64 `json:"expires_in"`
}

type DocGenResponse struct {
	Status  string     `json:"status"`
	Code    int        `json:"code"`
	Message string     `json:"message"`
	Data    DocGenData `json:"data"`
}
