import express, {Application, Request, Response, Router} from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import codeOperationsRouter from './routes/codeOperations';
import config from './utils/constants';
import projectsOperationsRouter from './routes/projectsOperations';
import {initializeKubeClient} from './store/k8s/kubeClient';
import '@kubernetes/client-node';
import openApiYamlOperationsRouter from './routes/openApiYamlOperations';
import Logger from './utils/logger';
import morganMiddleware from './utils/morganMiddleware';
import k8sOperationsRouter from './routes/k8sOperations';
import gitPlatformsOperationsRouter from './routes/gitPlatformOperations';
import usersOperationsRouter from './routes/usersOperations';

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Email-ID');
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
routes.use('/code', codeOperationsRouter);
routes.use('/openapi', openApiYamlOperationsRouter);

routes.use('/users', usersOperationsRouter);
routes.use('/', projectsOperationsRouter);
routes.use('/', gitPlatformsOperationsRouter);

app.use(routes);

app.get('*', (req, res) => {
    return res.status(200).json('you have reached default route');
});

app.listen(parseInt(config.serverPort as string, 10), '0.0.0.0', () => {
    Logger.info(`Server is up and running @ http://0.0.0.0:${config.serverPort}`);
});

export default app;