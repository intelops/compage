import {AuthBackendApi} from "./backend-api";

export default {
    async authenticate(code: string) {
        const response = await AuthBackendApi().post("/authenticate", {
            code: code
        });
        return response.data;
    },
}