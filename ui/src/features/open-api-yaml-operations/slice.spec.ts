import openApiYamlOperationsReducer, {OpenApiYamlOperationsState} from './slice';

describe('openApiYaml reducer', () => {
    const initialState: OpenApiYamlOperationsState = {
        uploadYaml: {
            data: {},
            status: 'idle',
            error: null
        }
    };

    it('should handle initial state', () => {
        expect(openApiYamlOperationsReducer(undefined, {type: 'unknown'})).toEqual({
            generateCode: {
                data: {},
                status: 'idle',
                error: null
            }
        });
    });
});
