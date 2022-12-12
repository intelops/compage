import {CustomObjectsApi, KubeConfig} from "@kubernetes/client-node";

const group = "compage.kube-tarian.github.com";
const version = "v1alpha1";
const plural = "projects";

const kubeConfig = new KubeConfig();
if (process.env.NODE_ENV === 'development') {
    kubeConfig.loadFromDefault();
} else {
    kubeConfig.loadFromCluster();
}
const client = kubeConfig.makeApiClient(CustomObjectsApi);

export const getProject = async (name: string, namespace: string) => {
    return await client.getNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        name
    );
}

export const createProject = async (payload: string, namespace: string) => {
    return await client.createNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        JSON.parse(payload)
    );
}

export const listProjects = async (payload: string, namespace: string) => {
    return await client.listNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
    );
}

const namespace = "compage";
const name = "project-2";
// project payload
const payload = "{\n" +
    "    \"apiVersion\": \"compage.kube-tarian.github.com/v1alpha1\",\n" +
    "    \"kind\": \"Project\",\n" +
    "    \"metadata\": {\n" +
    "        \"name\": \"project-2\",\n" +
    "        \"namespace\": \"compage\"\n" +
    "    },\n" +
    "    \"spec\": {\n" +
    "        \"id\": \"first-project-id\",\n" +
    "        \"metadata\": \"sampleKey: sampleValue\\n\",\n" +
    "        \"name\": \"project-2\",\n" +
    "        \"repository\": {\n" +
    "            \"branch\": \"main\",\n" +
    "            \"name\": \"first-project\",\n" +
    "            \"tag\": \"v1\"\n" +
    "        },\n" +
    "        \"user\": {\n" +
    "            \"email\": \"mahendra.b@intelops.dev\",\n" +
    "            \"name\": \"mahendraintelops\"\n" +
    "        },\n" +
    "        \"version\": \"v1\",\n" +
    "        \"yaml\": \"this is sample yaml string\\n\"\n" +
    "    }\n" +
    "}"
createProject(payload, namespace).then(r => {
    console.log(JSON.stringify(r))
    console.log("--------------------------------")
})
getProject(name, namespace).then(r => {
    console.log(JSON.stringify(r))
    console.log("--------------------------------")
})
listProjects(name, namespace).then(r => {
    console.log("List of Projects")
    console.log(JSON.stringify(r))
    console.log("--------------------------------")
})