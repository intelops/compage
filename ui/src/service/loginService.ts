import BackendApi from "./BackendApi";

export default {
    async authenticate(code: string) {
        const response = await BackendApi().post("authenticate", {
            code: code
        });
        return response.data;
    },
}