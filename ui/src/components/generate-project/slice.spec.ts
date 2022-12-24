import generateProjectReducer, {GenerateProjectState,} from './slice';

describe('counter reducer', () => {
    const initialState: GenerateProjectState = {
        data: {
            projectId: "",
            error: "",
            message: "",
            userName: ""
        },
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(generateProjectReducer(undefined, {type: 'unknown'})).toEqual({
            data: {
                "name": "",
                "fileChunk": undefined
            },
            status: 'idle',
            error: null
        });
    });
});
