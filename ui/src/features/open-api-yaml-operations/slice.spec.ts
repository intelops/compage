import codeOperationsReducer, {OpenApiYamlOperationsState} from './slice';

describe('codeOperations reducer', () => {
    const initialState: OpenApiYamlOperationsState = {
        uploadYaml: {
            data: {},
            status: 'idle',
            error: null
        }
    };

    it('should handle initial state', () => {
        expect(codeOperationsReducer(undefined, {type: 'unknown'})).toEqual({
            generateCode: {
                data: {},
                status: 'idle',
                error: null
            }
        });
    });
});
