//TODO externalise the below keys
export const config = {
    client_id: "5f8b8208ffa000316d2d",
    redirect_uri: "http://localhost:3000/login",
    proxy_url_authenticate: "http://localhost:5000/authenticate",
    proxy_url_create_repo: "http://localhost:5000/create_repo",
    proxy_url_generate_project: "http://localhost:5000/generate_project",
    proxy_url_list_repos: "http://localhost:5000/list_repos",
    proxy_url_check_token: "http://localhost:5000/check_token",
    proxy_url_logout: "http://localhost:5000/logout",
    proxy_url_commit_changes: "http://localhost:5000/commit_changes",
    proxy_url_pull_changes: "http://localhost:5000/pull_changes",
    server_port: 5000
};