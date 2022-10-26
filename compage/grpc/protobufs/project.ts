'use strict';

export const generateProject = (client, payload) => {
    client.GenerateProject(payload, (err, response) => {
        if (err) {
            console.log(err)
        }
        console.log("response received : ", response);
    });
}

export const getProjectGrpcClient = () => {
    const PROTO_PATH = __dirname + '/project.proto';
    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');

    let packageDefinition = protoLoader.loadSync(
        PROTO_PATH,
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        }
    );

    const ProjectService = grpc.loadPackageDefinition(
        packageDefinition).project.ProjectService;

    return new ProjectService(`192.168.1.124:50051`, grpc.credentials.createInsecure());
}