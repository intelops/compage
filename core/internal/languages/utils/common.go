package utils

func GetProtoBufDataType(value string) string {
	switch value {
	case "rune":
		fallthrough
	case "byte":
		fallthrough
	case "uintptr":
		fallthrough
	case "int":
		fallthrough
	case "int16":
		fallthrough
	case "int32":
		return "int32"
	case "int64":
		return "int64"
	case "uint":
		fallthrough
	case "uint8":
		fallthrough
	case "uint16":
		fallthrough
	case "uint32":
		return "uint32"
	case "uint64":
		return "int64"
	case "bool":
		return "bool"
	case "float32":
		return "float"
	case "complex64":
		fallthrough
	case "complex128":
		fallthrough
	case "float64 ":
		return "double"
	case "[]byte":
		return "bytes"
	case "string":
		return "string"
	default:
		return "string"
	}
}

func GetSqliteDataType(value string) string {
	switch value {
	case "int":
		fallthrough
	case "int16":
		fallthrough
	case "int32":
		fallthrough
	case "int64":
		fallthrough
	case "uint8":
		fallthrough
	case "uint16":
		fallthrough
	case "uint32":
		fallthrough
	case "uint64":
		fallthrough
	case "uint":
		fallthrough
	case "rune":
		fallthrough
	case "byte":
		fallthrough
	case "uintptr":
		fallthrough
	case "bool":
		return "INTEGER"
	case "float32":
		fallthrough
	case "float64 ":
		fallthrough
	case "complex64":
		fallthrough
	case "complex128":
		return "REAL"
	case "string":
		return "TEXT"
	default:
		return "TEXT"
	}
}

func GetMySQLDataType(value string) string {
	switch value {
	case "int":
		fallthrough
	case "int16":
		fallthrough
	case "int32":
		fallthrough
	case "int64":
		fallthrough
	case "uint8":
		fallthrough
	case "uint16":
		fallthrough
	case "uint32":
		fallthrough
	case "uint64":
		fallthrough
	case "uint":
		fallthrough
	case "rune":
		fallthrough
	case "byte":
		fallthrough
	case "uintptr":
		return "INT"
	case "bool":
		return "BOOL"
	case "float32":
		fallthrough
	case "float64 ":
		return "FLOAT"
	case "complex64":
		fallthrough
	case "complex128":
		return "DOUBLE"
	case "string":
		return "VARCHAR(100)"
	default:
		return "VARCHAR(100)"
	}
}

func GetDefaultValueForDataType(value string) interface{} {
	switch value {
	case "int":
		fallthrough
	case "int16":
		fallthrough
	case "int32":
		fallthrough
	case "int64":
		fallthrough
	case "uint8":
		fallthrough
	case "uint16":
		fallthrough
	case "uint32":
		fallthrough
	case "uint64":
		fallthrough
	case "uint":
		fallthrough
	case "rune":
		fallthrough
	case "byte":
		fallthrough
	case "uintptr":
		return 1
	case "bool":
		return true
	case "float32":
		fallthrough
	case "float64":
		return 1.0
	case "complex64":
		fallthrough
	case "complex128":
		return 1.0
	case "string":
		return "sample string"
	default:
		return "defaultValue"
	}
}
