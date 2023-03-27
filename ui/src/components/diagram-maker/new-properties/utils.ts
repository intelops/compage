export const COMPAGE = "compage";
export const OPENAPI = "openApi";

export const isCompageTemplate = (input: string) => {
    return input === COMPAGE;
};

// compage template frameworks supported.
export const compageLanguageFrameworks = {
    "go": ["go-gin"],
};

// openapi template frameworks supported.
export const openApiLanguageFrameworks = {
    "go": ["go-server", "go-gin-server", "go-echo-server"],
    "javascript": ["nodejs-express-server"],
    "typescript": ["typescript-node", "typescript-axios"],
    "java": ["java-play-framework", "java-micronaut-server", "java-undertow-server", "spring"],
    "rust": ["rust-server"],
    "ruby": ["ruby-on-rails", "ruby-sinatra"],
    "python": ["python-flask"],
};