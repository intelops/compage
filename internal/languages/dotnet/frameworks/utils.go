package frameworks

import "strings"

type RestResourceData struct {
	SmallKebabCaseResourceNameSingular string
	SmallSnakeCaseResourceNameSingular string
	SmallResourceNameSingular          string
	SmallResourceNamePlural            string
	CapsResourceNameSingular           string
	CapsResourceNamePlural             string
	ResourcePostBody                   string
	ResourcePutBody                    string
	IsRESTCreateAllowed                bool
	IsRESTListAllowed                  bool
	IsRESTGetAllowed                   bool
	IsRESTPutAllowed                   bool
	IsRESTDeleteAllowed                bool
	IsRESTPatchAllowed                 bool
	IsRESTHeadAllowed                  bool
	IsRESTOptionsAllowed               bool
}

func AddRESTAllowedMethods(restResourceData *RestResourceData, restAllowedMethods []*string) {
	for _, method := range restAllowedMethods {
		if *method == "POST" {
			restResourceData.IsRESTCreateAllowed = true
		}
		if *method == "LIST" {
			restResourceData.IsRESTListAllowed = true
		}
		if *method == "GET" {
			restResourceData.IsRESTGetAllowed = true
		}
		if *method == "PUT" {
			restResourceData.IsRESTPutAllowed = true
		}
		if *method == "PATCH" {
			restResourceData.IsRESTPatchAllowed = true
		}
		if *method == "DELETE" {
			restResourceData.IsRESTDeleteAllowed = true
		}
		if *method == "HEAD" {
			restResourceData.IsRESTHeadAllowed = true
		}
		if *method == "OPTIONS" {
			restResourceData.IsRESTOptionsAllowed = true
		}
	}
}

func GetMicroServiceName(name string) string {
	splitted := strings.Split(name, "/")
	return splitted[len(splitted)-1]
}
