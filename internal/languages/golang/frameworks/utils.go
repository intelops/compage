package frameworks

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
	IsStringID                         bool
	IsIntID                            bool
}

type GrpcResourceData struct {
	SmallKebabCaseResourceNameSingular string
	SmallSnakeCaseResourceNameSingular string
	SmallResourceNameSingular          string
	SmallResourceNamePlural            string
	CapsResourceNameSingular           string
	CapsResourceNamePlural             string
	IsGRPCCreateAllowed                bool
	IsGRPCListAllowed                  bool
	IsGRPCGetAllowed                   bool
	IsGRPCPutAllowed                   bool
	IsGRPCDeleteAllowed                bool
	IsGRPCPatchAllowed                 bool
	IsGRPCHeadAllowed                  bool
	IsGRPCOptionsAllowed               bool
	IsStringID                         bool
	IsIntID                            bool
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

func AddGRPCAllowedMethods(grpcResourceData *GrpcResourceData, grpcAllowedMethods []*string) {
	for _, method := range grpcAllowedMethods {
		if *method == "POST" {
			grpcResourceData.IsGRPCCreateAllowed = true
		}
		if *method == "LIST" {
			grpcResourceData.IsGRPCListAllowed = true
		}
		if *method == "GET" {
			grpcResourceData.IsGRPCGetAllowed = true
		}
		if *method == "PUT" {
			grpcResourceData.IsGRPCPutAllowed = true
		}
		if *method == "PATCH" {
			grpcResourceData.IsGRPCPatchAllowed = true
		}
		if *method == "DELETE" {
			grpcResourceData.IsGRPCDeleteAllowed = true
		}
		if *method == "HEAD" {
			grpcResourceData.IsGRPCHeadAllowed = true
		}
		if *method == "OPTIONS" {
			grpcResourceData.IsGRPCOptionsAllowed = true
		}
	}
}
