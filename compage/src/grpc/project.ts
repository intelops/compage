'use strict';

import {config} from "../util/constants";

export const getProjectGrpcClient = () => {
    const PROTO_PATH = './protobufs/project.proto';
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

    return new ProjectService(`${config.compage_core_url}`, grpc.credentials.createInsecure());
}