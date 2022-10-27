import BackendApi from "./BackendApi";

const path = "/github"
export default {
    async authenticate(code: string) {
        const response = await BackendApi().post(path + "/authenticate", {
            code: code
        });
        return response.data;
    },
}