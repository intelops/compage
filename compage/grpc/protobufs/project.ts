'use strict';

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

    return new ProjectService(`compagecoreapp:50051`, grpc.credentials.createInsecure());
}