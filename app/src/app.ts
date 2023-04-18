import express, {Application, Request, Response, Router} from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import codeOperationsRouter from './routes/code-operations';
import authOperationsRouter from './routes/auth-operations';
import config from './util/constants';
import projectsOperationsRouter from './routes/projects-operations';
import {checkIfCrdsInstalled, checkIfSystemNamespaceExists, initializeKubeClient} from './store/kube-client';
import '@kubernetes/client-node';
import openApiYamlOperationsRouter from './routes/open-api-yaml-operations';
import Logger from './util/logger';
import morganMiddleware from './util/morganMiddleware';
import k8sOperationsRouter from './routes/k8s-operations';

export const {customObjectsApiClient, coreV1ApiClient, currentContext} = initializeKubeClient();

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(morganMiddleware);

// Enabled Access-Control-Allow-Origin', '*' in the header to by-pass the CORS error.
app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // Needed for PUT requests
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-User-Name');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// app.get('/logger', (_, res) => {
//     Logger.error('This is an error log');
//     Logger.warn('This is a warn log');
//     Logger.info('This is a info log');
//     Logger.http('This is a http log');
//     Logger.debug('This is a debug log');
//     res.send('Hello world');
// });

app.get('/', (req: Request, res: Response) => {
    res.send('TS App is Running');
});

const routes = Router();
routes.use('/k8s', k8sOperationsRouter);
routes.use('/projects', projectsOperationsRouter);
routes.use('/code', codeOperationsRouter);
routes.use('/auth', authOperationsRouter);
routes.use('/openapi', openApiYamlOperationsRouter);
app.use(routes);

app.get('*', (req, res) => {
    return res.status(200).json('you have reached default route');
});

const isTest = (process.env.NODE_ENV === 'test');
if (!isTest) {
    // check if there is a valid kubernetes cluster and crds installed on it.
    checkIfCrdsInstalled().then(resources => {
        Logger.debug(resources);
        Logger.info('connection to K8s cluster is successful and it seems that crds are installed too.');
    }).catch(e => {
        Logger.error('It seems that crds are not yet installed, please check if you have applied crds');
        Logger.debug(e);
        process.exit(0);
    });

    // check if there is a system namespace exists.
    checkIfSystemNamespaceExists().then(namespaces => {
        let hasFound = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < namespaces.items.length; i++) {
            if (namespaces.items[i].metadata.name === config.system_namespace) {
                hasFound = true;
                break;
            }
        }
        if (!hasFound) {
            Logger.error(`It seems that system namespace doesn't exist, please check if you have created namespace with name ${config.system_namespace}`);
            process.exit(0);
        } else {
            Logger.info(`The namespace '${config.system_namespace}' exists on the cluster, good to go.`);
        }
    }).catch(e => {
        Logger.error(`It seems that system namespace doesn't exist, please check if you have created namespace with name ${config.system_namespace}`);
        Logger.debug(e);
        process.exit(0);
    });
}

app.listen(parseInt(config.server_port as string, 10), '0.0.0.0', () => {
    Logger.info(`Server is up and running @ http://0.0.0.0:${config.server_port}`);
});

export default app;