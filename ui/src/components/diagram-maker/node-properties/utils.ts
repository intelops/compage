// templates
export const COMPAGE = "compage";
export const OPENAPI = "openAPI";

// languages
export const GO = "go";
export const JAVASCRIPT = "javascript";
export const TYPESCRIPT = "typescript";
export const JAVA = "java";
export const RUST = "rust";
export const RUBY = "ruby";
export const PYTHON = "python";
export const LANGUAGES = [GO, JAVA, JAVASCRIPT, RUST, RUBY, PYTHON /*,TYPESCRIPT*/];

// compage template frameworks supported.
export const COMPAGE_LANGUAGE_FRAMEWORKS = {
    [GO]: ["go-gin-server"],
};

// compage template frameworks supported.
export const COMPAGE_LANGUAGE_GRPC_FRAMEWORKS = {
    [GO]: ["go-grpc-server"],
};

// compage template sql_dbs supported.
export const COMPAGE_LANGUAGE_SQL_DBS = {
    [GO]: ["MySQL", "SQLite"],
};

// openapi template frameworks supported.
export const OPENAPI_LANGUAGE_FRAMEWORKS = {
    [GO]: ["go-server", "go-gin-server", "go-echo-server"],
    [JAVASCRIPT]: ["nodejs-express-server"],
    // [TYPESCRIPT]: ["typescript-node", "typescript-axios"],
    [JAVA]: [/*"java-play-framework", */"java-micronaut-server", "java-undertow-server", "spring"],
    [RUST]: ["rust-server"],
    [RUBY]: ["ruby-on-rails", "ruby-sinatra"],
    [PYTHON]: ["python-flask"],
};

// checks if the template is compage.
export const isCompageTemplate = (input: string) => {
    return input === COMPAGE;
};
