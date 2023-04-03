export const INT = "int";
export const BOOL = "bool";
export const STRING = "string";
export const FLOAT = "float";
export const COMPLEX = "complex";

// Go data types for custom template
export const goDataTypes = {
    [INT]: [
        "int8",
        "int16",
        "int32",
        "int64",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "int",
        "uint",
        "rune",
        "byte",
        "uintptr",
    ],
    [FLOAT]: ["float32", "float64 "],
    [COMPLEX]: ["complex64", "complex128"],
    [BOOL]: ["bool"],
    [STRING]: ["string"],
};
