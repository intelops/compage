import {AuthBackendApi} from "./BackendApi";

export default {
    async authenticate(code: string) {
        const response = await AuthBackendApi().post("/authenticate", {
            code: code
        });
        return response.data;
    },
}