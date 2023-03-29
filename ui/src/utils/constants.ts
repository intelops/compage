import assert from 'assert';

// const configValue : string = process.env.REACT_APP_SOME_CONFIGURATION

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
console.log("process.env.REACT_APP_GITHUB_APP_CLIENT_ID: ", process.env.REACT_APP_GITHUB_APP_CLIENT_ID);
console.log("process.env.REACT_APP_GITHUB_APP_REDIRECT_URI: ", process.env.REACT_APP_GITHUB_APP_REDIRECT_URI);
console.log("process.env.REACT_APP_COMPAGE_APP_SERVER_URL: ", process.env.REACT_APP_COMPAGE_APP_SERVER_URL);

// github config
const REACT_APP_GITHUB_APP_CLIENT_ID = process.env.REACT_APP_GITHUB_APP_CLIENT_ID;
assert.ok(REACT_APP_GITHUB_APP_CLIENT_ID, 'The "REACT_APP_GITHUB_APP_CLIENT_ID" environment variable is required');
const REACT_APP_GITHUB_APP_REDIRECT_URI = process.env.REACT_APP_GITHUB_APP_REDIRECT_URI;
assert.ok(REACT_APP_GITHUB_APP_REDIRECT_URI, 'The "REACT_APP_GITHUB_APP_REDIRECT_URI" environment variable is required');
// app server config
const REACT_APP_COMPAGE_APP_SERVER_URL = process.env.REACT_APP_COMPAGE_APP_SERVER_URL;
assert.ok(REACT_APP_COMPAGE_APP_SERVER_URL, 'The "REACT_APP_COMPAGE_APP_SERVER_URL" environment variable is required');

export const config = {
    client_id: REACT_APP_GITHUB_APP_CLIENT_ID,
    redirect_uri: REACT_APP_GITHUB_APP_REDIRECT_URI,
    backend_base_url: REACT_APP_COMPAGE_APP_SERVER_URL,
};

// GoLang Data types are declared
export const goDataTypes = {
    int: [
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
    float: ["float32", "float64 "],
    complex: ["complex64", "complex128"],
    bool: ["bool"],
    string: ["string"],
  };